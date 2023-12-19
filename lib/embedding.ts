import { OpenAI } from "../deps.ts";
import { Cache } from "../lib/cache.ts";
import { config } from "../config.ts";

// if cache is found
const loadEmbedding = (key: string, cache: Cache) => {
  const entry = cache.find((entry) => entry.key === key);
  if (entry === undefined) {
    return undefined;
  }
  return entry.embedding;
};

// if cache is not found
const fetchEmbedding = async (key: string) => {
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  });

  const chatCompletion = await openai.embeddings.create({
    input: [key],
    model: config.model,
  });

  return chatCompletion.data[0].embedding;
};

// loadEmbedding if cache is found, otherwise fetchEmbedding
const getEmbedding = (key: string, cache: Cache | undefined) => {
  if (cache !== undefined) {
    const embedding = loadEmbedding(key, cache);
    if (embedding !== undefined) {
      return embedding;
    }
  }
  return fetchEmbedding(key);
};

export { getEmbedding };
