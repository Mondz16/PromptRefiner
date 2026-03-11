import OpenAI from "openai";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key-here") return null;
  return new OpenAI({ apiKey });
}

function buildFallbackRefinedPrompt(inputPrompt, options = {}) {
  const { target, tone, format } = options;
  const cleaned = inputPrompt.trim();

  const lines = [
    `You are an expert ${target || "AI assistant"}.`,
    "Your task is to respond to the following user request in a clear, structured, and helpful way.",
    tone ? `Use a ${tone} tone.` : null,
    format ? `Format the answer as: ${format}.` : null,
    "",
    "User request:",
    cleaned,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function refinePrompt(inputPrompt, options = {}) {
  const client = getClient();

  if (!client) {
    console.warn("OpenAI is not configured. Falling back to local prompt builder.");
    return buildFallbackRefinedPrompt(inputPrompt, options);
  }

  const { target, tone, format } = options;

  const systemMessage = [
    "You are an expert prompt engineer. Your job is to rewrite and improve the user's raw prompt to make it clearer, more specific, and highly effective for AI models.",
    "When rewriting, follow these principles:",
    "- Be explicit about the desired output, format, and context.",
    "- Add missing constraints or clarifications that improve the response quality.",
    "- Keep the core intent of the original prompt intact.",
    "- Do NOT answer the prompt — only rewrite it.",
    target ? `- The prompt is intended for: ${target}.` : null,
    tone ? `- The desired tone is: ${tone}.` : null,
    format ? `- The desired output format is: ${format}.` : null,
    "Return only the refined prompt text, with no explanation or preamble.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: inputPrompt.trim() },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  return response.choices[0].message.content.trim();
}
