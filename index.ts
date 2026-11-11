import { generateText } from "ai";

// Example: Vercel AI Gateway via the AI SDK.
// Requires AI_GATEWAY_API_KEY in the environment (.env.local – never commit it).
// Run: npx tsx --env-file=.env.local index.ts
async function main() {
  const { text } = await generateText({
    model: "moonshotai/kimi-k3",
    prompt: "Invent a new holiday and describe its traditions.",
  });
  console.log(text);
}

main().catch((err) => {
  console.error("Request failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
