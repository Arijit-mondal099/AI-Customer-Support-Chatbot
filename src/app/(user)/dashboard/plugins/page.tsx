"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, CheckCircle2, ChevronRight, Globe, Link2Off, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const plugins = [
  {
    name: "Notion",
    desc: "Connect Notion databases and pages as knowledge sources.",
    icon: BookOpen,
    status: "dynamic" as const,
  },
  {
    name: "Website Widget",
    desc: "Embed the chat widget on any site with a single script tag.",
    icon: Globe,
    status: "active" as const,
  },
];

export default function PluginsPage() {
  const [notionConnected, setNotionConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tokenValue, setTokenValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((data) => setNotionConnected(data.hasNotionIntegration ?? false))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveToken = async (token: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notionIntegrationToken: token }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotionConnected(data.hasNotionIntegration);
        setDialogOpen(false);
      }
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const disconnect = () => saveToken("");

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm mb-3">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            PLUGINS
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Plugins</h1>
        <p className="text-sm text-muted-foreground">
          Connect your agents to the tools you already use.
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {plugins.map((p) => {
          const Icon = p.icon;
          const isNotion = p.name === "Notion";
          const resolvedStatus = isNotion ? (notionConnected ? "active" : "configure") : "active";

          return (
            <motion.div
              key={p.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            >
              <Card className="gap-0 transition-all hover:-translate-y-1 hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Icon size={18} />
                  </div>
                  {resolvedStatus === "active" ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-300 bg-emerald-50 text-emerald-700"
                    >
                      <CheckCircle2 size={11} className="mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">Configure</Badge>
                  )}
                </CardHeader>
                <CardContent className="mt-4 space-y-4">
                  <div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <CardDescription className="mt-1">{p.desc}</CardDescription>
                  </div>
                  {isNotion ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTokenValue("");
                          setDialogOpen(true);
                        }}
                        disabled={loading}
                      >
                        {notionConnected ? "Update key" : "Connect"}
                      </Button>
                      {notionConnected && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={disconnect}
                          disabled={saving}
                          className="text-destructive hover:text-destructive"
                        >
                          <Link2Off size={13} className="mr-1" />
                          Disconnect
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      render={<Link href="/dashboard/agents" />}
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                    >
                      Configure
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notion Integration</DialogTitle>
            <DialogDescription>
              Paste your Notion internal integration token to connect your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="notion-token">Integration Token</Label>
            <Input
              id="notion-token"
              type="password"
              value={tokenValue}
              onChange={(e) => setTokenValue(e.target.value)}
              placeholder="ntn_..."
            />
          </div>
          <DialogFooter>
            <Button onClick={() => saveToken(tokenValue)} disabled={saving || !tokenValue.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
