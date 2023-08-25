import { findLLMOrThrow, useModelsStore } from '~/modules/llms/store-llms';
import { DMessage, useChatStore } from '~/common/state/store-chats';
import { runEmbeddingsUpdatingState } from '~/modules/aifn/embeddings/agi-embeddings';
import { callChatGenerateWithFunctions, VChatFunctionIn, VChatMessageIn } from '~/modules/llms/llm.client';
import { runAssistantUpdatingState } from 'src/apps/chat/editors/chat-stream';
import { createAssistantTypingMessage, updatePurposeInHistory } from 'src/apps/chat/editors/editors';

import { SystemPurposeId } from 'src/data';
import { countModelTokens } from '~/common/llm-util/token-counter';
import { DLLMId } from '~/modules/llms/llm.types';


/**
 * Convenience function to count the tokens in a DMessage object
 */
function updateDMessageTokenCount(message: DMessage, llmId: DLLMId | null, forceUpdate: boolean, debugFrom: string): number {
  if (forceUpdate || !message.tokenCount)
    message.tokenCount = llmId ? countModelTokens(message.text, llmId, debugFrom) : 0;
  return message.tokenCount;
}

/**
 * Convenience function to update a set of messages, using the current chatLLM
 */
function updateTokenCounts(messages: DMessage[], forceUpdate: boolean, debugFrom: string): number {
  const { chatLLMId } = useModelsStore.getState();
  return 3 + messages.reduce((sum, message) => 4 + updateDMessageTokenCount(message, chatLLMId, forceUpdate, debugFrom) + sum, 0);
}

function removeSecondElement(list: any[]){
  list.splice(1,1)
  return list
}

function getFunctionTokens(){
  return 114
}

function deleteOldMessagesIfNeeded(funcLLMId: string, history: DMessage[]){
  const llm = findLLMOrThrow(funcLLMId);
  var maxContextTokens = llm?.contextTokens;

  // TESTE APAGAR -------------
  // maxContextTokens = 1000;
  // --------------------------

  console.log("maxContextTokens", maxContextTokens)

  const responseTokens = llm.options?.llmResponseTokens!
  console.log("responseTokens", responseTokens)

  const functionTokens = getFunctionTokens();

  var tokenCounts = updateTokenCounts(history, false, 'setMessages');
  console.log("tokenCounts", tokenCounts)

  var totalUsedTokens = tokenCounts + responseTokens + functionTokens;
  console.log("totalUsedTokens", totalUsedTokens)

  while (totalUsedTokens > maxContextTokens!){
    console.log("tokenCounts + responseTokens > maxContextTokens");
    console.log(`Before: ${tokenCounts} + ${responseTokens} + ${functionTokens} = ${totalUsedTokens} > ${maxContextTokens}`)

    history = removeSecondElement(history);
    tokenCounts = updateTokenCounts(history, false, 'deleteOldMessagesIfNeeded');
    totalUsedTokens = tokenCounts + responseTokens + functionTokens;
    console.log(`After: ${tokenCounts} + ${responseTokens} + ${functionTokens} = ${totalUsedTokens} > ${maxContextTokens}`)
  }
}

const suggestUserFollowUpFn: VChatFunctionIn = {
  name: 'search_database',
  description:
    'Utilizada para buscar na base de dados da Target Teal os conteúdos mencionados pelo usuário. Deve ser usada somente se o conteúdo não estiver disponível em mensagens anteriores',
  parameters: {
    type: 'object',
    properties: {
      question_as_user: {
        type: 'string',
        description: 'O nome do conteúdo para buscar no banco de dados, por exemplo "Descrever Tensão", "Avaliar Tensão", "Analisar Forças"',
      },
    },
    required: ['question_as_user'],
  },
};

/**
 * Para buscar no Pinecone info para a sysmsg
 */
export async function autoSuggestions(systemPurposeId: SystemPurposeId, conversationId: string, history: DMessage[], historyTokenCount: number) {
  // use valid fast model
  const { funcLLMId, llms } = useModelsStore.getState();

  if (!funcLLMId) return;
 
  const vChatMessages: VChatMessageIn[] = history.map((dMessage) => {
    const { text, role } = dMessage;
    return {
      role,
      content: text,
    };
  });

  // update the system message from the active Purpose, if not manually edited
  history = updatePurposeInHistory(conversationId, history, systemPurposeId);
  
  deleteOldMessagesIfNeeded(funcLLMId, history);

  // create a blank and 'typing' message for the assistant
  var assistantMessageId = createAssistantTypingMessage(conversationId, funcLLMId, history[0].purposeId, '...');

  if (history.length > 0) {
    
    var chatResponse = await callChatGenerateWithFunctions(funcLLMId, vChatMessages, [suggestUserFollowUpFn]);

    const functionArguments = chatResponse?.function_arguments ?? {};
    if ('question_as_user' in functionArguments) {
      var question = typeof functionArguments.question_as_user === 'string' ? functionArguments.question_as_user : undefined;
      
      if (question) {
        await runEmbeddingsUpdatingState(conversationId, history, question, funcLLMId);
        assistantMessageId = createAssistantTypingMessage(conversationId, funcLLMId, history[0].purposeId, '...');
      
        deleteOldMessagesIfNeeded(funcLLMId, history);
      
      }
    }
  }

  runAssistantUpdatingState(conversationId, history, funcLLMId, true, assistantMessageId);
}
