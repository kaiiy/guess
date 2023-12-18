import { Cache } from "./cache.ts";
import { OpenAI } from "./deps.ts";
import { config } from "./config.ts";

const init = async () => {
  await Deno.mkdir("./db", { recursive: true });
  const kv = await Deno.openKv("./db/cache.db");

  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  });

  const params = {
    input: config.targets,
    model: "text-embedding-ada-002",
  };
  const chatCompletion = await openai.embeddings.create(params);

  const entries: Cache = chatCompletion.data.map((entry, index) => {
    return {
      key: params.input[index],
      embedding: entry.embedding,
    };
  });

  await kv.set(["cache"], entries);
};
export { init };
