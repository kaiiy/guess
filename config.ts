import { targets } from "./target.ts";

const config = {
  targets,
  model: {
    chat: "gpt-3.5-turbo",
    embedding: "text-embedding-ada-002",
  },
};

export { config };
