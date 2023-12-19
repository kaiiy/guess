import { targets } from "./target.ts";

const config = {
  db: {
    table: "cache",
    dir: `${Deno.env.get("HOME")}/.local/share/kaiiy/guess`,
    file: "cache.db",
  },
  targets,
  model: "text-embedding-ada-002",
};

export { config };
