
import { ChatGenerateSchema } from '~/modules/llms/openai/openai.router';
import { DLLMId } from '~/modules/llms/llm.types';
import { LLMOptionsOpenAI, normalizeOAISetup, SourceSetupOpenAI } from '~/modules/llms/openai/openai.vendor';
import { OpenAI } from '~/modules/llms/openai/openai.types';
import { SystemPurposeId } from '../../../data';
import { apiAsync } from '~/modules/trpc/trpc.client';
import { autoTitle } from '~/modules/aifn/autotitle/autoTitle';
import { findLLMOrThrow } from '~/modules/llms/store-llms';
import { speakText } from '~/modules/elevenlabs/elevenlabs.client';
import { useElevenlabsStore } from '~/modules/elevenlabs/store-elevenlabs';
import { DMessage, useChatStore } from '~/common/state/store-chats';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";



/**
 * The main "chat" function. TODO: this is here so we can soon move it to the data model.
 */
export const runEmbeddingsUpdatingState = async (conversationId: string, history: DMessage[], question: string, assistantLlmId: DLLMId, systemPurpose: SystemPurposeId) => {
    // update the system message from the active Purpose, if not manually edited
    console.log(history)
    const systemMessage = await getSystemMessageWithEmbeddings(question);
    history = appendSystemMessageToHistory(conversationId, history, systemMessage);

    // create a blank and 'typing' message for the assistant
    const assistantMessageId = createAssistantTypingMessage(conversationId, assistantLlmId, history[0].purposeId, '...');

    // when an abort controller is set, the UI switches to the "stop" mode
    const controller = new AbortController();
    const {startTyping, editMessage} = useChatStore.getState();
    startTyping(conversationId, controller);

    await streamAssistantMessage(conversationId, assistantMessageId, history, assistantLlmId, editMessage, controller.signal);

    // clear to send, again
    startTyping(conversationId, null);

    // update text, if needed
    await updateAutoConversationTitle(conversationId);
};

export function appendSystemMessageToHistory(conversationId: string, history: DMessage[], systemMessage: DMessage): DMessage[] {
    history.push(systemMessage);
    useChatStore.getState().setMessages(conversationId, history);
    return history;
}
async function getSystemMessageWithEmbeddings(question: string): Promise<DMessage> {
    let docsString = await callPublish(question);
    docsString = docsString || '';
    console.log(docsString);
    const systemMessage: DMessage = createDMessage('system', docsString);
    return systemMessage;
}
export function updatePurposeInHistory(conversationId: string, history: DMessage[], systemMessageNew: string | null, purposeId: SystemPurposeId): DMessage[] {
    const systemMessageIndex = history.findIndex(m => m.role === 'system');
    const systemMessage: DMessage = systemMessageIndex >= 0 ? history.splice(systemMessageIndex, 1)[0] : createDMessage('system', '');
    if (!systemMessage.updated && purposeId && SystemPurposes[purposeId]?.systemMessage) {
        systemMessage.purposeId = purposeId;
        systemMessage.text = systemMessageNew ? systemMessageNew : SystemPurposes[purposeId].systemMessage.replaceAll('{{Today}}', new Date().toISOString().split('T')[0]);
    }
    history.unshift(systemMessage);
    useChatStore.getState().setMessages(conversationId, history);
    return history;
}

export function createAssistantTypingMessage(conversationId: string, ssistantLlmId: DLLMId | 'prodia' | 'react-...', assistantPurposeId: SystemPurposeId | undefined, text: string): string {
    const assistantMessage: DMessage = createDMessage('assistant', text);
    assistantMessage.typing = true;
    assistantMessage.purposeId = assistantPurposeId;
    assistantMessage.originLLM = ssistantLlmId;
    useChatStore.getState().appendMessage(conversationId, assistantMessage);
    return assistantMessage.id;
}


/**
 * Main function to send the chat to the assistant and receive a response (streaming)
 */
async function streamAssistantMessage(
    conversationId: string, assistantMessageId: string, history: DMessage[],
    DLLMId: string,
    editMessage: (conversationId: string, messageId: string, updatedMessage: Partial<DMessage>, touch: boolean) => void,
    abortSignal: AbortSignal,
) {

    const {modelTemperature, modelMaxResponseTokens, elevenLabsAutoSpeak} = useSettingsStore.getState();
    const payload: OpenAI.API.Chat.Request = {
        api: getOpenAISettings(),
        model: DLLMId,
        messages: history.map(({role, text}) => ({
            role: role,
            content: text,
        })),
        temperature: modelTemperature,
        max_tokens: modelMaxResponseTokens,
    };
    console.log(payload)
    try {

        const response = await fetch('/api/openai/stream-chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
            signal: abortSignal,
        });

        if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            // loop forever until the read is done, or the abort controller is triggered
            let incrementalText = '';
            let parsedFirstPacket = false;
            let sentFirstParagraph = false;
            while (true) {
                const {value, done} = await reader.read();

                if (done) break;

                incrementalText += decoder.decode(value, {stream: true});

                // there may be a JSON object at the beginning of the message, which contains the model name (streaming workaround)
                if (!parsedFirstPacket && incrementalText.startsWith('{')) {
                    const endOfJson = incrementalText.indexOf('}');
                    if (endOfJson > 0) {
                        const json = incrementalText.substring(0, endOfJson + 1);
                        incrementalText = incrementalText.substring(endOfJson + 1);
                        try {
                            const parsed: OpenAI.API.Chat.StreamingFirstResponse = JSON.parse(json);
                            editMessage(conversationId, assistantMessageId, {originLLM: parsed.model}, false);
                            parsedFirstPacket = true;
                        } catch (e) {
                            // error parsing JSON, ignore
                            console.log('Error parsing JSON: ' + e);
                        }
                    }
                }

                // if the first paragraph (after the first packet) is complete, call the callback
                if (parsedFirstPacket && elevenLabsAutoSpeak === 'firstLine' && !sentFirstParagraph) {
                    let cutPoint = incrementalText.lastIndexOf('\n');
                    if (cutPoint < 0)
                        cutPoint = incrementalText.lastIndexOf('. ');
                    if (cutPoint > 100 && cutPoint < 400) {
                        sentFirstParagraph = true;
                        const firstParagraph = incrementalText.substring(0, cutPoint);
                        speakText(firstParagraph).then(() => false /* fire and forget, we don't want to stall this loop */);
                    }
                }

                editMessage(conversationId, assistantMessageId, {text: incrementalText}, false);
            }
        }

    } catch (error: any) {
        if (error?.name === 'AbortError') {
            // expected, the user clicked the "stop" button
        } else {
            // TODO: show an error to the UI
            console.error('Fetch request error:', error);
        }
    }

    // finally, stop the typing animation
    editMessage(conversationId, assistantMessageId, {typing: false}, false);
}
