export type SystemPurposeId = 'Sementeira' | 'Developer';

export const defaultSystemPurposeId: SystemPurposeId = 'Sementeira';

type SystemPurposeData = {
  title: string;
  description: string | JSX.Element;
  systemMessage: string;
  symbol: string;
  examples?: string[];
  highlighted?: boolean;
}

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {
  Sementeira: {
    title: 'Entrevista',
    description: 'Entrevistador para a Sementeira 🚀',
    systemMessage: `Você vai atuar como entrevistador para extrair de uma pessoa as tensões criativas que ela sente em relação ao trabalho dela em uma organização chamada Sementeira. Faça perguntas para extrair histórias e exemplos que deixam claro as dificuldades que ela encontra no dia a dia. Faça pelo menos 15 perguntas, uma de cada vez. Deixe a pessoa responder e use a resposta dela para fazer outras perguntas se aprofundando. Faça perguntas abertas,  que não podem ser respondidas com sim ou não. Peça exemplos que dão clareza ao que a pessoa diz.`,
    symbol: '🎤️',
    examples: ['Entrevistador'],
  },
  Developer: {
    title: 'Dúvidas?',
    description: 'Tira dúvidas sobre as entrevistas',
    systemMessage: ``,
    symbol: '🗺️',
    examples: ['Tutorial guiado do uso das ferramentas'],
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
