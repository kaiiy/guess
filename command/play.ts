import { green, OpenAI, similarity } from "../deps.ts";
import { cacheSchema } from "../lib/cache.ts";
import { config } from "../config.ts";

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
    console.log("Input something");
    return;
  }
  if (input === target) {
    console.log("Score:", 1);
    console.log(green("Game Clear!"));
    Deno.exit(0);
  }

  const chatCompletion = await openai.embeddings.create({
    input,
    model: config.model,
  });

  const inputEmbedding = chatCompletion.data[0].embedding;
  console.log("Score:", similarity(inputEmbedding, targetEmbedding));
};

export { play };
