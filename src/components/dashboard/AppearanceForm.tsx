"use client";

import { useState } from "react";
import { Check, Save, Send } from "lucide-react";
import { Input } from "@/components/Input";
import { apiClient } from "@/lib/axios";
import { useRouter } from "next/navigation";
import type { SerializedBot } from "@/lib/chatbots";

export const AppearanceForm = ({ bot }: { bot: SerializedBot }) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [accentColor, setAccentColor] = useState(bot.appearance.accentColor);
  const [avatarUrl, setAvatarUrl] = useState(bot.appearance.avatarUrl);
  const [displayName, setDisplayName] = useState(bot.appearance.displayName);
  const [welcomeMessage, setWelcomeMessage] = useState(bot.appearance.welcomeMessage);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await apiClient.put(`/api/chatbots/${bot._id}`, {
        appearance: { accentColor, avatarUrl, displayName, welcomeMessage },
      });
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">Accent color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        <Input
          type="text"
          label="Display name"
          placeholder="Support Agent"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <Input
          type="url"
          label="Avatar image URL"
          placeholder="https://…/avatar.png"
          hint="Leave empty to use the default avatar icon."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />

        <Input
          type="textarea"
          label="Welcome message"
          placeholder="Hello! How can I assist you today?"
          rows={3}
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
        />

        <button
          onClick={save}
          disabled={saving || saved}
          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
            saved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {saved ? <Check size={13} /> : <Save size={13} />}
          {saved ? "Saved!" : saving ? "Saving…" : "Save appearance"}
        </button>
      </div>

      {/* Live preview */}
      <div>
        <span className="mb-3 block text-xs font-semibold font-title uppercase tracking-widest text-slate-400">
          Live preview
        </span>
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#0d0d12] px-4 py-4 text-white">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #ff8a4c)` }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              )}
            </div>
            <div>
              <div className="text-[13px] font-semibold leading-tight">
                {displayName || "Support Agent"}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] text-white/50">online · ready to help</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-3 bg-[#faf8f4] px-4 py-5" style={{ minHeight: 180 }}>
            <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-[13.5px] text-[#0d0d12] shadow-sm">
              {welcomeMessage || "Hello! How can I assist you today?"}
            </div>
            <div
              className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[13.5px] text-white"
              style={{ background: "#0d0d12" }}
            >
              Hi! I have a question about my order.
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 border-t border-black/5 bg-[#f7f5f0] px-3 py-3">
            <div className="flex-1 rounded-xl border border-black/10 bg-[#faf8f4] px-3 py-2 text-[13px] text-[#9b9691]">
              Ask anything…
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{ background: accentColor }}
            >
              <Send size={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
