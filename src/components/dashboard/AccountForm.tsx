"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Provider = "gemini" | "openai";

export const AccountForm = () => {
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<Provider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get("/api/account");
        if (data.success) {
          setEmail(data.account.email);
          setProvider(data.account.provider === "openai" ? "openai" : "gemini");
          setMaskedKey(data.account.apiKeyMasked);
          setHasKey(data.account.hasApiKey);
        }
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await apiClient.put("/api/account", { provider, apiKey });
      if (data.success) {
        setMaskedKey(data.account.apiKeyMasked);
        setHasKey(data.account.hasApiKey);
        setApiKey("");
        toast.success("Account updated");
      } else {
        toast.error(data.message || "Could not save.");
      }
    } catch {
      toast.error("Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const providerLabel = provider === "openai" ? "OpenAI" : "Google Gemini";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Your default AI provider and key, shared by agents without their own key.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI provider</CardTitle>
          <CardDescription>Signed in as {email || "…"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label>Provider</Label>
            <div className="grid max-w-sm grid-cols-2 gap-2">
              {(["gemini", "openai"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={cn(
                    "cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition",
                    provider === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  {p === "gemini" ? "Google Gemini" : "OpenAI"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountKey">{providerLabel} API key</Label>
            {hasKey && (
              <p className="font-mono text-xs text-muted-foreground">
                Current: <span className="text-foreground">{maskedKey}</span>
              </p>
            )}
            <div className="relative max-w-md">
              <Input
                id="accountKey"
                type={show ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  hasKey ? "Enter a new key to replace" : `Paste your ${providerLabel} key`
                }
                className="pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition hover:text-foreground"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button onClick={save} disabled={saving || !apiKey.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
