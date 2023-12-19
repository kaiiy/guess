import { Command, green } from "./deps.ts";
import { play } from "./command/play.ts";
import { initDb } from "./command/init.ts";
import { resetCache } from "./command/reset.ts";
import { config } from "./config.ts";
import { getEmbedding } from "./lib/embedding.ts";

const main = () => {
  new Command()
    .name("guess")
    .version("0.0.5")
    .description("Guess the target word")
    // default command
    .action(async () => {
      // init
      await initDb();

      const targetKey =
        config.targets[Math.floor(Math.random() * config.targets.length)];
      const target = {
        key: targetKey,
        embedding: await getEmbedding(targetKey, undefined),
      };

      // play
      while (true) {
        const input = prompt(green(">"));
        if (input === null) {
          return;
        }
        if (input.length === 0) {
          console.log("Target:", target.key);
          return;
        }
        await play(target, input.trim());
      }
    })
    // reset command
    .command("reset", "Reset cache.")
    .action(async () => {
      await resetCache();
    })
    .parse();
};

if (import.meta.main) {
  main();
}
