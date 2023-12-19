import { targets } from "./target.ts";

const config = {
  db: {
    table: "cache",
    dir: `${Deno.env.get("HOME")}/.local/share/kaiiy/guess`,
    file: "cache.db",
  },
  targets,
  model: {
    chat: "gpt-3.5-turbo",
    embedding: "text-embedding-ada-002",
  },
};

export { config };
