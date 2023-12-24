import { OpenAI } from "../deps.ts";
import { config } from "../config.ts";

const fetchEmbedding = async (key: string) => {
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  });

  const chatCompletion = await openai.embeddings.create({
    input: [key],
    model: config.model.embedding,
  });

  return chatCompletion.data[0].embedding;
};

const fetchEmbeddings = async (keys: string[]) => {
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  });

  const chatCompletion = await openai.embeddings.create({
    input: keys,
    model: config.model.embedding,
  });

  return chatCompletion.data.map((data) => data.embedding);
};

export { fetchEmbedding, fetchEmbeddings };
