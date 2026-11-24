"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Friend { _id: string; name: string; personality: string; voiceId: string; avatarUrl?: string; }

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selected, setSelected] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/friends").then((r) => r.json()).then(setFriends);
  }, []);

  async function send() {
    if (!input.trim() || !selected) return;
    const userMsg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ messages: next, friend: selected }) });
    const data = await res.json();
    setMessages([...next, { role: "assistant", content: data.reply }]);
    setLoading(false);
    // TTS
    const audioRes = await fetch("/api/tts", { method: "POST", body: JSON.stringify({ text: data.reply, voiceId: selected.voiceId }) });
    const blob = await audioRes.blob();
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
  }

  if (!selected) {
    return (
      <main className="min-h-screen p-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">Who would you like to talk to?</h1>
        <div className="space-y-3">
          {friends.map((f) => (
            <Card key={f._id} className="p-4 cursor-pointer" onClick={() => setSelected(f)}>
              <div className="text-2xl font-semibold">{f.name}</div>
              <div className="text-sm text-muted-foreground">{f.personality}</div>
            </Card>
          ))}
          {friends.length === 0 && <p className="text-muted-foreground">No friends yet. Add one below.</p>}
          <Link href="/add"><Button className="w-full text-lg py-6">Add someone to talk to</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col max-w-md mx-auto p-4">
      <header className="flex items-center gap-3 mb-4">
        <Button variant="ghost" onClick={() => setSelected(null)}>←</Button>
        <div className="w-12 h-12 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center text-xl font-bold">
          {selected.avatarUrl ? <img src={selected.avatarUrl} alt={selected.name} className="w-full h-full object-cover" /> : selected.name[0]}
        </div>
        <h2 className="text-2xl font-bold">{selected.name}</h2>
      </header>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-muted-foreground">...</div>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Say something..." className="text-lg" />
        <Button type="submit" disabled={loading}>Send</Button>
      </form>
    </main>
  );
}
