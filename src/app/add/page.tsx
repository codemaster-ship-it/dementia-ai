"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function AddFriend() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", personality: "", voiceId: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/friends", { method: "POST", body: JSON.stringify(form) });
    router.push("/");
  }

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add someone to talk to</h1>
      <form onSubmit={submit} className="space-y-4">
        <Card className="p-4 space-y-3">
          <Input placeholder="Their name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="text-lg" required />
          <textarea
            placeholder="A short note about them"
            value={form.personality}
            onChange={(e) => setForm({ ...form, personality: e.target.value })}
            className="w-full rounded-xl border p-3 text-lg"
            rows={3}
            required
          />
          <Input placeholder="ElevenLabs voice ID" value={form.voiceId} onChange={(e) => setForm({ ...form, voiceId: e.target.value })} className="text-lg" required />
          <Input placeholder="Avatar image URL (optional)" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} className="text-lg" />
        </Card>
        <Button type="submit" disabled={saving} className="w-full text-lg py-6">
          {saving ? "Saving..." : "Save"}
        </Button>
      </form>
    </main>
  );
}
