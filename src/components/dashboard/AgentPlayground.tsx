"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Bot, RotateCcw, Send } from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { useSendMessage } from "@/hooks/use-chat";
import { MODELS, PROVIDERS } from "@/lib/options";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "model";
  text: string;
}

export const AgentPlayground = ({ bot }: { bot: SerializedBot }) => {
  const welcome: Msg = { role: "model", text: bot.appearance.welcomeMessage || "Hello!" };
  const [messages, setMessages] = useState<Msg[]>([welcome]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const sendMutation = useSendMessage();

  const providerLabel = PROVIDERS.find((p) => p.value === bot.provider)?.label ?? bot.provider;
  const modelLabel = MODELS[bot.provider]?.find((m) => m.value === bot.model)?.label || "Default";
  const accent = bot.appearance.accentColor || "#1b1a17";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMutation.isPending]);

  const reset = () => {
    setMessages([welcome]);
    setError("");
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sendMutation.isPending) return;
    setError("");
    const history = messages.slice(1).map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    try {
      const data = await sendMutation.mutateAsync({
        botId: bot._id,
        prompt: text,
        preview: true,
        history,
      });
      if (data.success && data.data) {
        const reply = data.data.text;
        setMessages((prev) => [...prev, { role: "model", text: reply }]);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Request failed.");
    }
  };

  const keyMissing = error.toLowerCase().includes("api key");

  return (
    <Card className="flex h-[32rem] flex-col gap-0 overflow-hidden py-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
            style={{ background: accent }}
          >
            <Bot size={15} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Playground</p>
            <p className="text-[11px] text-muted-foreground">
              {providerLabel} · {modelLabel}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} disabled={sendMutation.isPending}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={`${i}-${m.text.slice(0, 20)}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
                m.role === "user"
                  ? "ml-auto rounded-br-sm text-white"
                  : "rounded-bl-sm bg-muted text-foreground",
              )}
              style={m.role === "user" ? { background: accent } : undefined}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {sendMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3"
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0 }}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              {error}
              {keyMissing && (
                <>
                  {" "}
                  <Link
                    href={`/dashboard/bots/${bot._id}/config`}
                    className="font-medium underline"
                  >
                    Add a key
                  </Link>
                  .
                </>
              )}
            </span>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border px-3 py-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Send a message to test your agent…"
          disabled={sendMutation.isPending}
        />
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button onClick={send} disabled={sendMutation.isPending || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </Card>
  );
};
