// import { Document } from 'langchain/dist/document';
import { Brand } from '~/common/brand';

export const requireUserKeyEmbeddings = !process.env.HAS_SERVER_KEY_OPENAI_EMBEDDINGS;

export const isValidDatabaseUrl = (apiKey?: string) => !!apiKey; /*&& apiKey.startsWith("redis")*/
export const index = 'tt-kb';
export const dbHost = '59ae7db1-15f6-46e9-82c5-84b2ef7f2953';
export const docsCount = 1;
export const destination = 'pinecone.com';
export const CmdRunEmbeddings: string[] = ['/embed', '/', '/ '];
export const embeddingsDefaultDocCount: string = '1';
// const openaiKey = access.oaiKey || process.env.OPENAI_API_KEY || '';

export async function callPublish(question: string): Promise<string | null> {
  try {
    const body = {
      to: destination,
      question: question,
      dbHost: dbHost,
      indexdb: index,
      docsCount: docsCount,
    };

    const response = await fetch('/api/publishPinecone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const res = await response.json();

      if (res.type === 'success') {
        // we log this to the console for extra safety
        console.log('Data from middleware', res);
        return res.prompt;
      }

      if (res.type === 'error') throw new Error(`Failed to send the req`);
    }

    throw new Error(`Failed to request db`);
  } catch (error) {
    console.error('Publish issue', error);
    alert(`Publish issue: ${error}`);
  }
  return null;
}

/// Returns a pretty link to the current page, for promo
function getOrigin() {
  let origin = typeof window !== 'undefined' ? window.location.href : '';
  if (!origin || origin.includes('//localhost')) origin = Brand.URIs.OpenRepo;
  origin = origin.replace('https://', '');
  if (origin.endsWith('/')) origin = origin.slice(0, -1);
  return origin;
}
