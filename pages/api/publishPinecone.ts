// noinspection ExceptionCaughtLocallyJS

import { NextRequest, NextResponse } from 'next/server';

import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { openAIAccess } from '~/modules/llms/openai/openai.router';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

export default async function handler(req: NextRequest) {
  try {
    const { to, question, dbHost, indexdb, docsCount } = await req.json();
    if (req.method !== 'POST' || to !== 'pinecone.com' || !question) throw new Error('Invalid options');
    const index = !indexdb ? 'tt-kb' : indexdb;
    let defaultPrompt: string = `Use esse conteúdo extraído da base de dados da Target Teal para ajudar o usuário. 
        O conteúdo dessa mensagem não está visível ao usuário.
        Se o conteúdo não tiver relação, diga que sua pesquisa não encontrou informações relacionadas na base. 
        ----------------
        `;
    const client = new PineconeClient();
    await client.init({
      apiKey: dbHost,
      environment: 'us-west4-gcp',
    });

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const pineconeIndex = client.Index(index);
    const docsearch = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
    const docs = await docsearch.similaritySearchWithScore(question, docsCount);

    let docsString = defaultPrompt;
    let foundRelevantContent = false;

    docs.forEach((docScorePair) => {
      let doc = docScorePair[0];
      let score = docScorePair[1];
      if (score >= 0.8) {
        foundRelevantContent = true;
        docsString += doc.pageContent + '\\n\\n';
      }
    });

    if (!foundRelevantContent) {
      docsString += 'Não foi encontrado conteúdo relevante.';
    }

    return new NextResponse(
      JSON.stringify({
        type: 'success',
        prompt: docsString,
      }),
    );
  } catch (error) {
    console.error('api/publish error:', error);
    return new NextResponse(
      JSON.stringify({
        type: 'error',
        error: error?.toString() || 'Network issue',
      }),
      { status: 500 },
    );
  }
}

// noinspection JSUnusedGlobalSymbols
export const config = {
    runtime: 'edge',
};