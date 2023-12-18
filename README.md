# Guess

Guess the target word

## Requirements

- [Deno](https://deno.land/)

## Setup

```bash
# Set the OpenAI API key
$ export OPENAI_API_KEY=<your key here>
# Install the command
$ deno install --allow-read --allow-write --allow-env --allow-net --unstable -n guess https://raw.githubusercontent.com/kaiiy/guess/main/cli.ts
```

## Usage

```bash
# Initialize the game
$ guess init
# Play the game
$ guess play <word>
```