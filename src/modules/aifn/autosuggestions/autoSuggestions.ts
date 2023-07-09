import { callChatGenerateWithFunctions, VChatFunctionIn } from '~/modules/llms/llm.client';
import { useModelsStore } from '~/modules/llms/store-llms';
import { useChatStore } from '~/common/state/store-chats';

const suggestUserFollowUpFn: VChatFunctionIn = {
  name: 'suggest_user_prompt',
  description: 'Para sugerir métodos úteis no design organizacional, como descrever papéis e mapear círculos.',
  parameters: {
    type: 'object',
    properties: {
      question_as_user: {
        type: 'string',
        description: 'Pergunte como se o usuário quisesse um método da tecnologia social O2',
      },
      title: {
        type: 'string',
        description: 'Título do Método, e.g. Descritor Master de Papéis',
      },
    },
    required: ['question_as_user', 'title'],
  },
};

/**
 * Formulates proposals for follow-up questions, prompts, and counterpoints, based on the last 2 chat messages
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

  // LLM
  callChatGenerateWithFunctions(funcLLMId, [
    { role: 'system', content: systemMessage.text },
    { role: 'user', content: userMessage.text },
    { role: 'assistant', content: assistantMessage.text },
  ], [
    suggestUserFollowUpFn,
  ]).then(chatResponse => {
    const functionArguments = chatResponse?.function_arguments ?? null;
    if (functionArguments && ('question_as_user' in functionArguments) && ('title' in functionArguments)) {
      const newAssistantMessage = `${assistantMessage.text}\n\Pergunta segundo a O2: ${functionArguments.question_as_user}\nMetodo: ${functionArguments.title}`
      editMessage(conversationId, assistantMessage.id, { text: newAssistantMessage }, false);
    }
    console.log(chatResponse);
  });
}
