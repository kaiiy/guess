import { Cache } from "../lib/cache.ts";
import { OpenAI } from "../deps.ts";
import { config } from "../config.ts";
import { cacheSchema, isEntryCached } from "../lib/cache.ts";

const isCached = (maybeCache: Deno.KvEntryMaybe<unknown>): boolean => {
  const _cache = cacheSchema.safeParse(maybeCache.value);
  if (!_cache.success) {
    return false;
  }
  const cache = _cache.data;
  return config.targets.every((target) => isEntryCached(cache, target));
};

const initDb = async () => {
  // init db
  await Deno.mkdir(config.db.dir, { recursive: true });
  const kv = await Deno.openKv(`${config.db.dir}/${config.db.file}`);

  // load cache
  const buffer = await kv.get(["cache"]);

  // fetch embeddings (if not cached)
  if (!isCached(buffer)) {
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const params = {
      input: config.targets,
      model: config.model,
    };
    const chatCompletion = await openai.embeddings.create(params);

    const entries: Cache = chatCompletion.data.map((entry, index) => {
      return {
        key: params.input[index],
        embedding: entry.embedding,
      };
    });

    await kv.set(["cache"], entries);
  }
};
export { initDb };
