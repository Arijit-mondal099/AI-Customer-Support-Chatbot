"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
    return (
      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
        <Card className="min-h-80">
          <CardContent className="py-5">
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-14 text-center">
          <MessageSquare className="mx-auto mb-3 text-muted-foreground/50" size={28} />
          <p className="text-sm text-muted-foreground">
            No conversations yet. Once visitors chat with this agent, they appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-2">
        {conversations.map((c) => (
          <button
            key={c._id}
            onClick={() => openConversation(c._id)}
            className={cn(
              "w-full cursor-pointer rounded-xl border px-4 py-3 text-left transition",
              selected === c._id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-muted-foreground/30",
            )}
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

      <Card className="min-h-80">
        <CardContent className="py-5">
          {!selected ? (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select a conversation to read the transcript.
            </p>
          ) : loadingThread ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-2/3 rounded-2xl" />
              <Skeleton className="ml-auto h-10 w-1/2 rounded-2xl" />
              <Skeleton className="h-16 w-3/4 rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
