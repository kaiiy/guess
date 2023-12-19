import { Cache } from "../lib/cache.ts";
import { config } from "../config.ts";
import { cacheSchema, isEntryCached } from "../lib/cache.ts";
import { getEmbedding } from "../lib/embedding.ts";

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
  const buffer = await kv.get([config.db.table]);

  // fetch embeddings if not cached
  if (!isCached(buffer)) {
    const entries: Cache = await Promise.all(
      config.targets.map(async (target) => {
        return {
          key: target,
          embedding: await getEmbedding(target, undefined),
        };
      }),
    );
    await kv.set([config.db.table], entries);
  }
};
export { initDb };
