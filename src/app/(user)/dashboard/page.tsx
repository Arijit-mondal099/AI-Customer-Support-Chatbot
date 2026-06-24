import { redirect } from "next/navigation";
import { Bot } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getAccountAnalytics } from "@/lib/analytics";
import { listChatbots } from "@/lib/chatbots";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OverviewContent } from "@/components/dashboard/OverviewContent";

export default async function OverviewPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const [analytics, bots] = await Promise.all([
    getAccountAnalytics(owner.ownerId),
    listChatbots(owner.ownerId),
  ]);

  if (bots.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Bot size={24} />
            </div>
            <CardTitle>Create your first agent</CardTitle>
            <CardDescription>
              Spin up an AI support agent, give it a persona and knowledge, and embed it anywhere.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/dashboard/agents/new"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <Bot className="h-4 w-4" /> New agent
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <OverviewContent analytics={analytics} />;
}
