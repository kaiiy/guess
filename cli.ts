import { Command, green } from "./deps.ts";
import { play } from "./command/play.ts";
import { config } from "./config.ts";
import { fetchEmbedding } from "./lib/embedding.ts";

const VERSION = "0.1.3";

const main = () => {
  new Command()
    .name("guess")
    .version(VERSION)
    .description("Guess the target word")
    // default command
    .action(async () => {
      // select target
      const targetKey =
        config.targets[Math.floor(Math.random() * config.targets.length)];
      const target = {
        key: targetKey,
        embedding: await fetchEmbedding(targetKey),
      };

      // command: play
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
    .parse();
};

if (import.meta.main) {
  main();
}
