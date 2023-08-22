import { useModelsStore } from '~/modules/llms/store-llms';
import { DMessage, useChatStore } from '~/common/state/store-chats';
import { runEmbeddingsUpdatingState } from '~/modules/aifn/embeddings/agi-embeddings';
import { callChatGenerateWithFunctions, VChatFunctionIn, VChatMessageIn } from '~/modules/llms/llm.client';
import { runAssistantUpdatingState } from 'src/apps/chat/editors/chat-stream';
import { createAssistantTypingMessage, updatePurposeInHistory } from 'src/apps/chat/editors/editors';

import { SystemPurposeId } from 'src/data';

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
export async function autoSuggestions(systemPurposeId: SystemPurposeId, conversationId: string, history: DMessage[]) {
  // use valid fast model
  const { funcLLMId } = useModelsStore.getState();
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

  // create a blank and 'typing' message for the assistant
  var assistantMessageId = createAssistantTypingMessage(conversationId, funcLLMId, history[0].purposeId, '...');

  //LLM
  if (history.length > 0) {

    var chatResponse = await callChatGenerateWithFunctions(funcLLMId, vChatMessages, [suggestUserFollowUpFn]);

    const functionArguments = chatResponse?.function_arguments ?? {};
    if ('question_as_user' in functionArguments) {
      var question = typeof functionArguments.question_as_user === 'string' ? functionArguments.question_as_user : undefined;
      
      if (question) {
        await runEmbeddingsUpdatingState(conversationId, history, question, funcLLMId);
        assistantMessageId = createAssistantTypingMessage(conversationId, funcLLMId, history[0].purposeId, '...');
      }
    }
  }

  runAssistantUpdatingState(conversationId, history, funcLLMId, true, assistantMessageId);
}
