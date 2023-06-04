// noinspection ExceptionCaughtLocallyJS

import {NextRequest, NextResponse} from 'next/server';

import {PasteGG} from '@/modules/pastegg/pastegg.types';
import {PineconeClient} from "@pinecone-database/pinecone";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {getOpenAISettings} from "@/modules/openai/openai.client";
import {PineconeStore} from "langchain/vectorstores/pinecone";



export default async function handler(req: NextRequest) {

    try {
        const {to, question, dbHost, indexdb, docsCount, openaiKey, origin} = await req.json();
        if (req.method !== 'POST' || to !== 'pinecone.com' || !question)
            throw new Error('Invalid options');
        const index = !indexdb ? "tt-kb" : indexdb
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
            openAIApiKey: openaiKey
        });
        const pineconeIndex = client.Index(index);
        const docsearch = await PineconeStore.fromExistingIndex(embeddings, {pineconeIndex});
        const docs = await docsearch.similaritySearch(question, docsCount);
        let docsString: string = docs.map(doc => doc.pageContent).join("\\n\\n");
        docsString = defaultPrompt + docsString;

        return new NextResponse(JSON.stringify({
            type: 'success',
            //url: `https://paste.gg/${paste.result.id}`,
            //expires: paste.result.expires || 'never',
            //deletionKey: paste.result.deletion_key || 'none',
            prompt: docsString,
        }));

    } catch (error) {

        console.error('api/publish error:', error);
        return new NextResponse(JSON.stringify({
            type: 'error',
            error: error?.toString() || 'Network issue',
        }), {status: 500});

    }

}

// noinspection JSUnusedGlobalSymbols
export const config = {
    runtime: 'edge',
};
