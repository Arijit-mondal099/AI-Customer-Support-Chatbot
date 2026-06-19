"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bot, Check, Copy } from "lucide-react";
import { ENV } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Embed = ({ botId }: { botId: string }) => {
  const script = `<script\n  src="${ENV.API_URI}/chat_bot.js"\n  data-bot-id="${botId}"\n></script>`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      toast.success("Snippet copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps = [
    { n: "01", title: "Copy the snippet", desc: "Grab this agent's personalised script tag." },
    { n: "02", title: "Paste before </body>", desc: "Add it just before the closing body tag." },
    { n: "03", title: "Save & deploy", desc: "Upload to your server or redeploy your site." },
    { n: "04", title: "See it live", desc: "The chat widget appears in the bottom-right." },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Embed this agent</CardTitle>
          <CardDescription>One script tag. Zero dependencies. Live on any website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">index.html</span>
              <Button variant="ghost" size="sm" onClick={copy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="overflow-x-auto bg-card px-5 py-5 font-mono text-[13px] leading-[1.9]">
              <code>
                <span className="text-muted-foreground">&lt;script</span>
                {"\n  "}
                <span className="text-foreground">src</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-[#e8440a]">&quot;{ENV.API_URI}/chat_bot.js&quot;</span>
                {"\n  "}
                <span className="text-foreground">data-bot-id</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-[#e8440a]">&quot;{botId}&quot;</span>
                {"\n"}
                <span className="text-muted-foreground">&gt;&lt;/script&gt;</span>
              </code>
            </pre>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            ↳ Place it just before your closing &lt;/body&gt; tag.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <Card key={s.n}>
            <CardContent className="space-y-2 py-5">
              <span className="font-title text-[11px] font-semibold tracking-widest text-muted-foreground">
                {s.n}
              </span>
              <h4 className="text-sm font-semibold">{s.title}</h4>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>Live preview</CardTitle>
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative flex h-56 items-center justify-center rounded-lg border border-border bg-muted/40">
            <span className="font-mono text-[13px] text-muted-foreground">
              Your website content
            </span>
            <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Bot />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
