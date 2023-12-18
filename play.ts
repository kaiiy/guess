import { OpenAI, similarity } from "./deps.ts";
import { cacheSchema } from "./cache.ts";
import { config } from "./config.ts";

const play = async (input: string) => {
  const kv = await Deno.openKv(`${config.db.dir}/${config.db.file}`);

  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  });

  const target = config.targets[0];

  const buffer = (await kv.get(["cache"])).value;
  const bufferResult = cacheSchema.safeParse(buffer);
  if (!bufferResult.success) {
    throw new Error("Cache is not valid");
  }
  const cache = bufferResult.data;
  const targetEmbedding = cache.find((entry) => entry.key === target)
    ?.embedding;
  if (targetEmbedding === undefined) {
    throw new Error("Target embedding is not found");
  }

  if (input.length === 0) {
    console.log("Input something (e.g. `guess play hello`)");
    return;
  }
  if (input === target) {
    console.log("Score:", 1);
    console.log("Game clear!");
    return;
  }

  const chatCompletion = await openai.embeddings.create({
    input,
    model: "text-embedding-ada-002",
  });

  const inputEmbedding = chatCompletion.data[0].embedding;
  console.log("Score:", similarity(inputEmbedding, targetEmbedding));
};

export { play };
