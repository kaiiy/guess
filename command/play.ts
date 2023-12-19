import { green } from "../deps.ts";
import { cacheSchema } from "../lib/cache.ts";
import { config } from "../config.ts";
import { getEmbedding } from "../lib/embedding.ts";

const calcSimilarity = (vec1: number[], vec2: number[]) => {
  if (vec1.length !== vec2.length) {
    return undefined;
  }

  const dotProduct = vec1.map((val, i) => val * vec2[i]).reduce(
    (acc, curr) => acc + curr,
    0,
  );
  const calcVecSize = (vec: number[]) => {
    return Math.sqrt(vec.reduce((acc, curr) => acc + curr ** 2, 0));
  };

  return dotProduct / (calcVecSize(vec1) * calcVecSize(vec2));
};

const calcScore = (cosSim: number) => {
  // let base = cosSim;
  // if (cosSim < 0) {
  //   base = 0;
  // }
  // const a = 10;
  // return (a ** base - 1) / (a - 1);
  return cosSim;
};

const play = async (input: string) => {
  const kv = await Deno.openKv(`${config.db.dir}/${config.db.file}`);

  const buffer = (await kv.get([config.db.table])).value;
  const bufferResult = cacheSchema.safeParse(buffer);
  if (!bufferResult.success) {
    throw new Error("Cache is not valid");
  }
  const cache = bufferResult.data;

  // get target embedding
  const target = config.targets[0];
  const targetEmbedding = await getEmbedding(target, cache);

  if (input === target) {
    console.log("Score:", 1);
    console.log(green("Game Clear!"));
    Deno.exit(0);
  }

  const inputEmbedding = await getEmbedding(input, cache);

  const similarity = calcSimilarity(inputEmbedding, targetEmbedding);
  if (similarity === undefined) {
    throw new Error("Failed to calc similarity");
  }
  const score = calcScore(similarity);
  console.log("Score:", score);
};

export { play };
