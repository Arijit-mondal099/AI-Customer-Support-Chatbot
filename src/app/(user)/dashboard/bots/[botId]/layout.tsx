import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { Badge } from "@/components/ui/badge";
import { TabBar } from "@/components/dashboard/TabBar";

export default async function BotLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ botId: string }>;
}) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/agents"
        className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Agents
      </Link>
      <header className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{bot.name}</h1>
        {bot.status === "live" ? (
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
            live
          </Badge>
        ) : (
          <Badge variant="secondary">draft</Badge>
        )}
      </header>
      <TabBar botId={bot._id} />
      <div className="py-6">{children}</div>
    </div>
  );
}
