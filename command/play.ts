import { green } from "../deps.ts";
import { CacheEntry } from "../lib/cache.ts";
import { fetchEmbedding } from "../lib/embedding.ts";
import { choiceYesNo } from "../lib/choice.ts";

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
  if (cosSim < 0.7) {
    return 0;
  }
  if (cosSim > 0.9) {
    return 1;
  }

  const value = (cosSim - 0.7) / (0.9 - 0.7);
  return 1 / 2 * Math.sin(Math.PI * (value - 1 / 2)) + 1 / 2;
};

const isQuestion = (input: string) => {
  return input.endsWith("?") || input.endsWith("？");
};

const play = async (target: CacheEntry, input: string) => {
  if (input === target.key) {
    console.log("Answer:", "yes");
    console.log("Similarity:", 1);
    console.log(green("Game Clear!"));
    Deno.exit(0);
  }

  // question
  if (isQuestion(input)) {
    const answer = await choiceYesNo(target.key, input);
    console.log("Answer:", answer);
    return;
  }

  // maybe word
  const inputEmbedding = await fetchEmbedding(input);
  const similarity = calcSimilarity(inputEmbedding, target.embedding);
  if (similarity === undefined) {
    throw new Error("Failed to calc similarity");
  }
  const score = calcScore(similarity);

  console.log("Similarity:", Math.round(score * 1000) / 1000);
};

export { play };
