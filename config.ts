const config = {
  db: {
    dir: `${Deno.env.get("HOME")}/.local/share/kaiiy/guess`,
    file: "cache.db",
  },
  targets: [
    "おはよう",
  ],
  model: "text-embedding-ada-002",
};

export { config };
