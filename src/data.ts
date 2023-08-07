export type SystemPurposeId = 'Suzano';

export const defaultSystemPurposeId: SystemPurposeId = 'Suzano';

type SystemPurposeData = {
  title: string;
  description: string | JSX.Element;
  systemMessage: string;
  symbol: string;
  examples?: string[];
  highlighted?: boolean;
}

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {
  Suzano: {
    title: 'Suzano',
    description: 'Entrevistador para a Suzano 🚀',
    systemMessage: `Você vai realizar uma entrevista para encontrar tensões criativas (problemas e oportunidades) que o entrevistado tem a respeito da aquisição da Kimberly-Clark e integração com a Suzano. Abaixo há uma lista de perguntas. Faça uma por vez, até que o usuário tenha respondido todas. As respostas serão registradas de maneira anônima.

1. Antes da aquisição você era funcionário da Suzano ou da Kimberly-Clark?
2. Atualmente você faz parte de qual área da Suzano?
3. Se um(a) amigo(a) seu recebesse uma oferta para trabalhar na Suzano UNBC após a aquisição e pedisse sua opinião sobre como é trabalhar aqui agora, o que você diria?
4. Que impactos a integração trouxe na sua rotina? O que você gostaria que fosse diferente?
5. Existem obstáculos específicos que surgiram desde a aquisição que estão impedindo você de realizar o seu melhor na Suzano?
6. Há algo específico sobre a integração das duas empresas que você gostaria de discutir, que ainda não abordamos nesta conversa?

Ao final agradeça e diga que em breve um compilado de todas as respostas de todos os entrevistados será apresentado na forma de um mapa.  Caso o entrevistado não forneça respostas específicas para as perguntas 2-6, peça por exemplos e detalhes. Seja insistente, a não ser que ele diga que não se sente à vontade em compartilhar detalhes, não sabe ou não se lembra.`,
    symbol: '🎤️',
    examples: ['Entrevistador'],
  },
};


export type ChatModelId = 'gpt-4' | 'gpt-3.5-turbo';

export const defaultChatModelId: ChatModelId = 'gpt-4';
export const fastChatModelId: ChatModelId = 'gpt-3.5-turbo';


type ChatModelData = {
  description: string | JSX.Element;
  title: string;
  fullName: string; // seems unused
  contextWindowSize: number;
  tradeoff: string;
}

export const ChatModels: { [key in ChatModelId]: ChatModelData } = {
  'gpt-4': {
    description: 'Mais poderoso, porém mais caro',
    title: 'gpt-4',
    fullName: 'gpt-4',
    contextWindowSize: 8192,
    tradeoff: 'Preciso, lento e caro',
  },
  'gpt-3.5-turbo': {
    description: 'Um bom custo benefício',
    title: '3.5-Turbo',
    fullName: 'GPT-3.5 Turbo',
    contextWindowSize: 4097,
    tradeoff: 'Rápido e Barato',
  },
};


export type SendModeId = 'immediate' | 'react' | 'embeddings';
export const defaultSendModeId: SendModeId = 'immediate';

type SendModeData = {
  label: string;
  description: string | JSX.Element;
}

export const SendModes: { [key in SendModeId]: SendModeData } = {
  'immediate': {
    label: 'Chat',
    description: 'Respostas diretamente dos assistentes',
  },
  'react': {
    label: 'Reason+Act',
    description: 'Responde perguntas usando reações e busca',
  },
  'embeddings': {
    label: 'Embeddings',
    description: 'Responde suas perguntas usando nossa base de dados customizada',
  }
};
