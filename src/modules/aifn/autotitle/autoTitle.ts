import { callChatGenerate } from '~/modules/llms/llm.client';
import { useModelsStore } from '~/modules/llms/store-llms';
import { useChatStore } from '~/common/state/store-chats';

export async function autoTitle(conversationId: string) {

  // use valid fast model
  const { fastLLMId } = useModelsStore.getState();
  if (!fastLLMId) return;

  // only operate on valid conversations, without any title
  const { conversations } = useChatStore.getState();
  const conversation = conversations.find(c => c.id === conversationId) ?? null;
  
  // Verificar se a conversa é válida e se tem pelo menos 3 mensagens do usuário
  if (!conversation || conversation.autoTitle || conversation.userTitle) return;
  const userMessageCount = conversation.messages.filter(m => m.role === 'user').length;
  if (userMessageCount < 3) return;

  // first line of the last 5 messages
  const historyLines: string[] = conversation.messages.filter(m => m.role !== 'system').slice(-5).map(m => {
    let text = m.text.split('\n')[0];
    text = text.length > 50 ? text.substring(0, 50) + '...' : text;
    text = `${m.role === 'user' ? 'You' : 'Assistant'}: ${text}`;
    return `- ${text}`;
  });

  // LLM
  callChatGenerate(fastLLMId, [
  { role: 'system', content: `Você é um Assistente de Títulos de Conversa em IA Especializado em Criar Títulos Expressivos com Poucas Palavras` },
    {
       role: 'user', content:
      'Analise a breve conversa fornecida (cada linha está truncada) e extraia um título de conversa conciso que ' +
      'resume a conversa em apenas algumas palavras.\n' +
      'Responda apenas com o título curto e mais nada.\n' +
        '\n' +
        '```\n' +
        historyLines.join('\n') +
        '```\n',
    },
  ]).then(chatResponse => {
    const title = chatResponse?.content
      ?.trim()
      ?.replaceAll('"', '')
      ?.replace('Title: ', '')
      ?.replace('title: ', '');
    
    if (title)
      useChatStore.getState().setAutoTitle(conversationId, title);
  });
}
