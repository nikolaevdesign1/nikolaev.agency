import { NextResponse } from "next/server";
import { answerFromSite, type ChatTurn } from "@/lib/chat/answer";
import { askGrok } from "@/lib/chat/grok";
import { addSpend, budgetAvailable } from "@/lib/chat/budget";

const MAX_MESSAGES = 30;
const MAX_LENGTH = 2000;
/** A visitor's own question; longer ones are refused to keep the cost of a reply small. */
const MAX_QUESTION = 1500;

function normalizeMessages(input: unknown): ChatTurn[] | null {
  if (!input || typeof input !== "object") return null;
  const messages = (input as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return null;
  }

  const turns: ChatTurn[] = [];
  for (const item of messages) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX_LENGTH) return null;
    turns.push({ role, content: trimmed });
  }

  if (turns[turns.length - 1]?.role !== "user") return null;
  return turns;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = normalizeMessages(body);
  if (!messages) {
    return NextResponse.json(
      { error: "Send a list of messages ending with a user message." },
      { status: 422 },
    );
  }

  const question = messages[messages.length - 1].content;
  if (question.length > MAX_QUESTION) {
    return NextResponse.json({ error: "Please keep the question under 1500 characters." }, { status: 422 });
  }

  // Grok answers while this month's budget lasts; otherwise, or on any failure, the built-in answers do.
  if (process.env.XAI_API_KEY && (await budgetAvailable())) {
    try {
      const { reply, usd } = await askGrok(messages);
      await addSpend(usd);
      return NextResponse.json({ reply, source: "grok" });
    } catch (error) {
      console.error("Grok did not answer", error);
    }
  }

  return NextResponse.json({
    reply: answerFromSite(messages),
    source: "site",
  });
}
