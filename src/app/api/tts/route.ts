import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, voiceId } = await req.json();
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({ text, model_id: "eleven_monolingual_v1" }),
  });
  const buf = await res.arrayBuffer();
  return new NextResponse(buf, { headers: { "Content-Type": "audio/mpeg" } });
}
