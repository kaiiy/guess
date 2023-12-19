import { OpenAI, z } from "../deps.ts";
import { config } from "../config.ts";

const answerSchema = z.union([
  z.literal("yes"),
  z.literal("probably yes"),
  z.literal("unknown"),
  z.literal("probably no"),
  z.literal("no"),
]);
type Answer = z.infer<typeof answerSchema>;

const choiceYesNo = async (
  target: string,
  question: string,
): Promise<Answer> => {
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  });

  const res = await openai.chat.completions.create({
    model: config.model.chat,
    messages: [{ role: "user", content: `「${target}」は${question}` }],
    n: 1,
    tools: [
      {
        type: "function",
        function: {
          name: "displayAnswer",
          description: "Display the answer to the question.",
          parameters: {
            type: "object",
            properties: {
              answer: {
                type: "number",
                description:
                  "「1」「2」「3」「4」「5」のいずれかの数字が入る。「1」が間違い。「2」がやや間違い。「3」がどちらとも言えない。「4」がやや正しい。「5」が正しい。",
              },
            },
          },
        },
      },
    ],
  });

  const toolCalls = res.choices[0].message.tool_calls;
  if (toolCalls === undefined) {
    return "unknown";
  }

  try {
    const arg = JSON.parse(toolCalls[0].function.arguments);
    const answer = arg.answer;

    if (typeof answer !== "number") {
      return "unknown";
    }
    switch (answer) {
      case 1:
        return "no";
      case 2:
        return "probably no";
      case 3:
        return "unknown";
      case 4:
        return "probably yes";
      case 5:
        return "yes";
      default:
        return "unknown";
    }
  } catch (_) {
    return "unknown";
  }
};

export { choiceYesNo };
