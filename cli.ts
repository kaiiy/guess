import { Command, green } from "./deps.ts";
import { play } from "./play.ts";
import { init } from "./init.ts";

const main = () => {
  new Command()
    .name("guess")
    .version("0.0.2")
    .description("Guess the target word")
    // initCommand
    .command("init", "Initialize the game")
    .action(init)
    // playCommand
    .command("play", "Play the game")
    .action(async () => {
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
    .parse(Deno.args);
};

if (import.meta.main) {
  main();
}
