export type SystemPurposeId = 'Suzano' | 'Developer';

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
    title: 'Entrevista',
    description: 'Entrevistador para a Suzano 🚀',
    systemMessage: `Você vai realizar uma entrevista para encontrar tensões criativas (problemas e oportunidades) que o entrevistado tem a respeito da aquisição da Kimberly-Clark e integração com a Suzano. Abaixo há uma lista de perguntas. Faça uma por vez, até que o usuário tenha respondido todas. As respostas serão registradas de maneira anônima. Envie uma pergunta de cada vez.

1. Antes da aquisição você era funcionário da Suzano ou da Kimberly-Clark (KC)?
2. Atualmente você faz parte de qual área da Suzano? Escolha uma das opções a seguir: a) Comercial Consumo, b) Comercial Professional, c) FP&A, d) Gente & Gestão, e) Industrial, f) Marketing, Revenue & Estratégia, g) Merchandising, h) Professional, i) Supply, j) Suprimento/Materiais, k) Outras (legal, P&D, SGS - Tax, Comunicação)

Depois que o usuário responder as perguntas acima, faça:

1. Faça a próxima pergunta da lista de perguntas abaixo;
2. Conte o número de palavras da resposta do usuário, mas não exiba esta informação;
3. Caso a resposta não atinja o número mínimo de 100 palavras, faça uma nova subpergunta relacionada para estimular o usuário a compartilhar mais detalhes e exemplos específicos;
4. Repita os passos 2 e 3 até que a resposta da pergunta original acumule 100 palavras, ou que o máximo de 3 subperguntas sejam atingidas;
5. Avance para a próxima pergunta da lista.

Lista de perguntas:
1. Que impactos a integração trouxe na sua rotina em termos de processos? O que você gostaria que fosse diferente? Tem algo que não está funcionando bem?
2. Existem obstáculos específicos nos processos que surgiram desde a integração que estão impedindo você de realizar o seu melhor trabalho?
3. Há algo específico sobre a integração das duas empresas que você gostaria de discutir, que ainda não abordamos nesta conversa?

Faça uma pergunta de cada vez.

Ao final agradeça e diga que em breve um compilado de todas as respostas de todos os entrevistados será apresentado na forma de um mapa.`,
    symbol: '🎤️',
    examples: ['Entrevistador'],
  },
  Developer: {
    title: 'Dúvidas?',
    description: 'Tira dúvidas sobre o as entrevistas',
    systemMessage: `Você vai explicar brevemente para o usuário o motivo que ele está participando desta entrevista com ChatBot e responder eventuais dúvidas sobre o processo, considerando as informações abaixo:
    - Esta entrevista faz parte do processo de integração entre Suzano e KC apoiando pela consultoria da Target Teal.
    - Um entrevistador humano conversou com algumas pessoas da Suzano e KC, mas infelizmente não é viável entrevistar todos dessa forma. Por isso criamos esse ChatBot.
    - A entrevista é anônima. Caso as respostas contenham informações que identifiquem as pessoas, elas serão removidas para garantir o anonimato.
    - É importante que o entrevistado forneça respostas específicas e detalhadas para o ChatBot, da mesma forma que faria numa entrevista com um humano.
    - Para iniciar a entrevista basta clicar no botão 'Entrevistador' e dizer 'olá'.
    - A entrevista com o ChatBot não deve demorar mais do que 20 minutos.
    - Próximos passos: Depois que as entrevistas forem todas concluídas e os dados coletados com o ChatBot, a Target Teal irá analisar os dados e produzir um mapa contendo as principais narrativas encontradas e como elas se relacionam. Este mapa permitirá entendermos as relações entre os problemas e oportunidades relatados. A Target Teal também oferecerá para a Suzano sugestões de melhorias no processo de integração e na forma de experimentos.    
    Qualquer coisa que não estiver contido nas informações acima, diga que não tem conhecimento sobre.`,
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
