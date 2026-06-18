import { redirect } from "next/navigation";
import { MessageSquare, Users, Clock } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { ConversationModel } from "@/models/conversation.model";
import { MessageModel } from "@/models/message.model";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default async function BotOverview({ params }: { params: Promise<{ botId: string }> }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  const [conversations, messages, latest] = await Promise.all([
    ConversationModel.countDocuments({ botId }),
    MessageModel.countDocuments({ botId }),
    ConversationModel.findOne({ botId }).sort({ lastMessageAt: -1 }).select("lastMessageAt").lean(),
  ]);

  const lastActiveAt = latest?.lastMessageAt
    ? new Date(latest.lastMessageAt as Date).toISOString()
    : null;

  const stats = [
    { label: "Conversations", value: conversations.toLocaleString(), icon: Users },
    { label: "Messages", value: messages.toLocaleString(), icon: MessageSquare },
    { label: "Last active", value: formatDate(lastActiveAt), icon: Clock },
  ];

  const details = [
    { label: "Display name", value: bot.botInfo.botName || bot.appearance.displayName || "—" },
    { label: "Business", value: bot.businessInfo.businessName || "—" },
    { label: "Industry", value: bot.businessInfo.industry || "—" },
    { label: "Support email", value: bot.supportEmail || "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <Icon size={15} />
                <span className="text-xs font-semibold uppercase tracking-widest">{s.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {details.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {it.label}
            </p>
            <p className="mt-1.5 truncate text-sm font-medium text-slate-800">{it.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
