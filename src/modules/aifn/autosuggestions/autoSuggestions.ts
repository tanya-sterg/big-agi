import { useModelsStore } from '~/modules/llms/store-llms';
import { useChatStore } from '~/common/state/store-chats';
import { runEmbeddingsUpdatingState } from '~/modules/aifn/embeddings/agi-embeddings';
import { callChatGenerateWithFunctions, VChatFunctionIn } from '~/modules/llms/llm.client';

const suggestUserFollowUpFn: VChatFunctionIn = {
  name: 'search_database',
  description: 'Para buscar na base de dados da Target Teal métodos úteis no design organizacional, como descrever papéis e mapear círculos.',
  parameters: {
    type: 'object',
    properties: {
      question_as_user: {
        type: 'string',
        description: 'Cite o nome do método para buscar no banco de dados',
      },
          },
    required: ['question_as_user'],
  },
};

/**
 * Para buscar no Pinecone info para a sysmsg
 */
export async function autoSuggestions(conversationId: string) {
  // use valid fast model
  const { funcLLMId } = useModelsStore.getState();
  if (!funcLLMId) return;

  // only operate on valid conversations
  const { conversations, editMessage } = useChatStore.getState();
  const conversation = conversations.find(c => c.id === conversationId) ?? null;
  if (!conversation) return;

  // get the first message of the conversation, and the last 2
  const systemMessage = conversation.messages[0];
  const [userMessage, assistantMessage] = conversation.messages.slice(-2);

  //LLM
  callChatGenerateWithFunctions(funcLLMId, [
    { role: 'system', content: systemMessage.text },
    { role: 'user', content: userMessage.text },
    { role: 'assistant', content: assistantMessage.text },
  ], [
    suggestUserFollowUpFn,
  ]).then(chatResponse => {
    console.log(chatResponse);
  });

    // Parse assistant message and extract 'question_as_user' from functionArguments
  const functionArguments = JSON.parse(assistantMessage.text);
  const question = functionArguments.question_as_user;
  if (!question) return;

  // runEmbeddingsUpdatingState function call
  const chatResponse = await runEmbeddingsUpdatingState(conversationId, conversation.messages, question, funcLLMId);

  console.log(chatResponse);
}