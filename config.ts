const config = {
  db: {
    table: "cache",
    dir: `${Deno.env.get("HOME")}/.local/share/kaiiy/guess`,
    file: "cache.db",
  },
  targets: [
    "多様性",
    "カレーうどん",
    "マニアック",
    "キッチンペーパー",
    "挑戦状",
    "気体",
    "目からウロコ",
    "キーボード",
    "カブト虫",
    "地図記号",
    "逮捕",
    "評判",
    "田んぼ",
    "半分",
    "本屋",
    "雑踏",
    "リスタート",
    "効果",
    "セーブデータ",
    "スプレー缶",
  ],
  model: "text-embedding-ada-002",
};

export { config };
