import { callChatGenerateWithFunctions, VChatFunctionIn } from '~/modules/llms/llm.client';
import { useModelsStore } from '~/modules/llms/store-llms';
import { useChatStore } from '~/common/state/store-chats';

const suggestUserFollowUpFn: VChatFunctionIn = {
  name: 'suggest_user_prompt',
  description: 'Para sugerir um jeito de descrever papéis',
  parameters: {
    type: 'object',
    properties: {
      question_as_user: {
        type: 'string',
        description: 'Proponha um método de descrição de papéis que começe com as atividades do dia-a-dia que a pessoa faz',
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

  // only operate on valid conversations, without any title
  const { conversations, editMessage } = useChatStore.getState();
  const conversation = conversations.find(c => c.id === conversationId) ?? null;
  if (!conversation || conversation.messages.length < 3) return;

  // get the first message of the conversation, and the last 2
  const systemMessage = conversation.messages[0];
  const [userMessage, assistantMessage] = conversation.messages.slice(-2);
  if (!(systemMessage?.role === 'system') || !(userMessage?.role === 'user') || !(assistantMessage?.role === 'assistant')) return;

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
      const newAssistantMessage = `${assistantMessage.text}\n\nQuestion Suggestion: ${functionArguments.question_as_user}\nTitle: ${functionArguments.title}`
      editMessage(conversationId, assistantMessage.id, { text: newAssistantMessage }, false);
    }
    console.log(chatResponse);
  });
}
