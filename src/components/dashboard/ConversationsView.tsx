"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { apiClient } from "@/lib/axios";

interface ConversationItem {
  _id: string;
  sessionId: string;
  messageCount: number;
  startedAt: string | null;
  lastMessageAt: string | null;
}

interface MessageItem {
  _id: string;
  role: "user" | "model";
  text: string;
  createdAt: string | null;
}

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const ConversationsView = ({ botId }: { botId: string }) => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get(`/api/chatbots/${botId}/conversations`);
        if (data.success) setConversations(data.conversations);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, [botId]);

  const openConversation = async (id: string) => {
    setSelected(id);
    setLoadingThread(true);
    try {
      const { data } = await apiClient.get(
        `/api/chatbots/${botId}/conversations?conversationId=${id}`,
      );
      if (data.success) setMessages(data.messages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingThread(false);
    }
  };

  if (loadingList) {
    return <p className="text-sm text-slate-400">Loading conversations…</p>;
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <MessageSquare className="mx-auto mb-3 text-slate-300" size={28} />
        <p className="text-sm text-slate-400">
          No conversations yet. Once visitors chat with this bot, their conversations appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      {/* List */}
      <div className="space-y-2">
        {conversations.map((c) => (
          <button
            key={c._id}
            onClick={() => openConversation(c._id)}
            className={`w-full cursor-pointer rounded-xl border px-4 py-3 text-left transition ${
              selected === c._id
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-xs opacity-70">
                {c.sessionId.slice(0, 14)}
              </span>
              <span className="shrink-0 text-[11px] opacity-70">{c.messageCount} msgs</span>
            </div>
            <p className="mt-1 text-[11px] opacity-60">{formatDate(c.lastMessageAt)}</p>
          </button>
        ))}
      </div>

      {/* Transcript */}
      <div className="min-h-[20rem] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {!selected ? (
          <p className="flex h-full items-center justify-center text-sm text-slate-400">
            Select a conversation to read the transcript.
          </p>
        ) : loadingThread ? (
          <p className="text-sm text-slate-400">Loading transcript…</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m._id}
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-slate-900 text-white"
                    : "rounded-bl-sm bg-slate-100 text-slate-800"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
