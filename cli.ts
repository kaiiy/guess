import { Command, green } from "./deps.ts";
import { play } from "./command/play.ts";
import { initDb } from "./command/init.ts";
import { resetCache } from "./command/reset.ts";

const main = () => {
  new Command()
    .name("guess")
    .version("0.0.4")
    .description("Guess the target word")
    // default command
    .action(async () => {
      // init
      initDb();

      // play
      while (true) {
        const input = prompt(green(">"));
        if (input === null) {
          return;
        }
        if (input.length === 0) {
          return;
        }
        await play(input.trim());
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
