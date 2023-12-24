import { z } from "../deps.ts";

const cacheEntrySchema = z.object({
  key: z.string(),
  embedding: z.array(z.number()),
});
type CacheEntry = z.infer<typeof cacheEntrySchema>;

const cacheSchema = z.array(cacheEntrySchema);
type Cache = z.infer<typeof cacheSchema>;

const addEntry = (cache: Cache, entry: CacheEntry): Cache => {
  if (cache.find((_entry) => _entry.key === entry.key) === undefined) {
    return [...cache, entry];
  }
  return cache;
};

export { addEntry, type Cache, type CacheEntry, cacheSchema };
