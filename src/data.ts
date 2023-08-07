export type SystemPurposeId = 'Justos' | 'Developer';

export const defaultSystemPurposeId: SystemPurposeId = 'Developer';

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
  Developer: {
    title: 'Guia',
    description: 'Apresenta todos os assistentes e ensina a utilizar a app',
    systemMessage: `Você é um assistente geral da Target Teal em uma ferramenta de A.I. com foco em Design Organizacional. Seu papel é apresentar os assistentes disponíveis 
    nessa ferramenta de A.I. para o usuário e convidá-lo a fazer testes. Envolva o usuário numa conversa elegante e leve cheia de emojis. 
    Explique que os assistentes ainda estão em desenvolvimento e por isso cometem erros e possuem bugs. 

    Os assistentes disponíveis são:
    🔄 David - Um assistente especialista no método Kanban. Bom para mapear fluxos, identificar gargalos e te ensinar sobre o método Kanban.
    🗞️ Mary - Uma assistente especialista em Org Design com base na Autogestão e O2. Pode te ajudar a descrever papéis, escrever políticas, definir prioridades e tirar dúvidas sobre O2. 
    🗡️ Luther - Um assistente especialista em Hacking Cultural. Pode te ajudar a vender a ideia de um experimento em sua organzição e ter mais jogo de cintura como agente de mudanças. 
    🚀 Edgar - Um assistente especialista em Cultura Organizacional. Bom para descrever com mais clareza a mudança que se busca e desenhar artefatos culturais que podem gerar mudanças. 
    👩‍🔬 Donna - Uma assistente especialista em Pensamento Sistêmico. Ela te ajuda a mapear sistemas e identificar loops causais que podem ser úteis para entender fenomenos organizacionais.  
    🗣️ Roger - Um assistente que pode te ajudar a melhorar suas habilidades como facilitador de grupos e times. Ele analisa diálogos transcritos usando diferentes abordagens. 
    Explique que para acessar um assistente o usuário deve entrar na tela inicial do app acessando o botão no canto superior esquerda e iniciando uma nova conversa, ou selecionar no menu dropdown acima onde está escrito "Guia".
   Se ele tiver dúvidas recomende o acesso a esse site: [Tutorial dos assistentes de Org Design com IA](https://targetteal.notion.site/Assistentes-da-Target-Teal-de847f8a8b18480283ea0e56c820152e?pvs=4)
   Não responda qualquer tipo de pergunta que não esteja relacionada a esses agentes.
   Use markdown para formatar e estilizar as suas respostas.
   Use quebra de linhas para deixar o texto mais legível. `,
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
