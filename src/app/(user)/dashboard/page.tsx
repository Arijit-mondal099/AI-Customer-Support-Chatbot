import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, Bot, MessageSquare, Plus, Users } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { getAccountAnalytics } from "@/lib/analytics";
import { listChatbots } from "@/lib/chatbots";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateBotButton } from "@/components/dashboard/CreateBotButton";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

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
            <CreateBotButton>
              <Plus className="h-4 w-4" /> New agent
            </CreateBotButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { totals, daily, topAgents, recent } = analytics;
  const stats = [
    { label: "Agents", value: totals.agents, icon: Bot },
    { label: "Live", value: totals.liveAgents, icon: Activity },
    { label: "Conversations", value: totals.conversations, icon: Users },
    { label: "Messages", value: totals.messages, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Activity across all your agents.</p>
        </div>
        <CreateBotButton>
          <Plus className="h-4 w-4" /> New agent
        </CreateBotButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{s.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Last 14 days across all agents</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart data={daily} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top agents</CardTitle>
            <CardDescription>By messages handled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topAgents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              topAgents.map((a) => (
                <div key={a._id} className="flex items-center justify-between gap-3">
                  <Link
                    href={`/dashboard/bots/${a._id}`}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {a.name}
                  </Link>
                  <span className="shrink-0 text-sm text-muted-foreground">{a.messages}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent conversations</CardTitle>
          <CardDescription>Latest sessions across your agents</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No conversations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead className="text-right">Last active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.botName}</TableCell>
                    <TableCell>{c.messageCount}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(c.lastMessageAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
