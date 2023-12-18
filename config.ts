const config = {
  db: {
    dir: `${Deno.env.get("HOME")}/.local/share/kaiiy/guess`,
    file: "cache.db",
  },
  targets: [
    "おはよう",
  ],
};

export { config };
