import { config } from "../config.ts";

const existsDir = async (path: string): Promise<boolean> => {
  try {
    const stat = await Deno.stat(path);
    return stat.isDirectory;
  } catch (_err) {
    return false;
  }
};

const resetCache = async () => {
  // Remove db (if exists)
  if (await existsDir(config.db.dir)) {
    await Deno.remove(config.db.dir, { recursive: true });
    console.log("Removed cache.");
  }
};
export { resetCache };
