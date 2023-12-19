import { Cache } from "../lib/cache.ts";
import { config } from "../config.ts";
import { cacheSchema, isEntryCached } from "../lib/cache.ts";
import { fetchEmbeddings } from "../lib/embedding.ts";

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
    const entries: Cache = (await fetchEmbeddings(["dummy"])).map(
      (embedding, i) => {
        return {
          key: config.targets[i],
          embedding,
        };
      },
    );
    await kv.set([config.db.table], entries);
  }
};
export { initDb };
