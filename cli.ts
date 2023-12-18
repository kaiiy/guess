import { Command } from "./deps.ts";
import { play } from "./play.ts";
import { init } from "./init.ts";

const main = () => {
  new Command()
    .name("guess")
    .version("0.0.1")
    .description("Guess the target word")
    // initCommand
    .command("init", "Initialize the game")
    .action(init)
    // playCommand
    .command("play <input...:string[]>", "Play the game")
    .action(async (_, input) => {
      await play(input.join(" "));
    })
    .parse(Deno.args);
};

if (import.meta.main) {
  main();
}
