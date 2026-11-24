import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
  });
  const { messages, friend } = await req.json();
  const completion = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: `You are ${friend?.name || "a friend"}. ${friend?.personality || ""}. Speak warmly, simply, and comfortingly to an elderly person with dementia. Keep replies short.` },
      ...messages,
    ],
  });
  return NextResponse.json({ reply: completion.choices[0]?.message?.content || "" });
}
