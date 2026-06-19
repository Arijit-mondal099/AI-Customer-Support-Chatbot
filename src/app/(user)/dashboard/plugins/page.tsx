import Link from "next/link";
import { Code2, Globe, MessageCircle, Slack, Webhook, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plugins = [
  {
    name: "Website Widget",
    desc: "Embed the chat widget on any site with a single script tag.",
    icon: Globe,
    status: "active" as const,
  },
  {
    name: "Slack",
    desc: "Forward conversations and alerts to a Slack channel.",
    icon: Slack,
    status: "soon" as const,
  },
  {
    name: "WhatsApp",
    desc: "Answer customers on WhatsApp Business.",
    icon: MessageCircle,
    status: "soon" as const,
  },
  {
    name: "Zapier",
    desc: "Connect thousands of apps with no-code automations.",
    icon: Zap,
    status: "soon" as const,
  },
  {
    name: "Webhooks",
    desc: "Stream conversation events to your own endpoints.",
    icon: Webhook,
    status: "soon" as const,
  },
  {
    name: "REST API",
    desc: "Build custom integrations on the SupportAI API.",
    icon: Code2,
    status: "soon" as const,
  },
];

export default function PluginsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plugins</h1>
        <p className="text-sm text-muted-foreground">
          Connect your agents to the tools you already use.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.name} className="gap-0">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Icon size={18} />
                </div>
                {p.status === "active" ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-300 bg-emerald-50 text-emerald-700"
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Coming soon</Badge>
                )}
              </CardHeader>
              <CardContent className="mt-4 space-y-4">
                <div>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <CardDescription className="mt-1">{p.desc}</CardDescription>
                </div>
                {p.status === "active" ? (
                  <Button render={<Link href="/dashboard/agents" />} variant="outline" size="sm">
                    Configure
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
