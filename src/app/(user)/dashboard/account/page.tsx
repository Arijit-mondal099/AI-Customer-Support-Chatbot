import { redirect } from "next/navigation";
import { ChevronRight, KeyRound, LogOut, Mail } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm mb-3">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            SETTINGS
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Your account.</p>
      </div>

      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>The account you&apos;re signed in with.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Mail size={16} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{owner.email || "—"}</p>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <Button variant="outline" render={<a href="/api/auth/logout" />} nativeButton={false}>
              <LogOut className="h-4 w-4" /> Log out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound size={16} /> API keys
          </CardTitle>
          <CardDescription>
            Each agent uses its own provider and API key. Set them in the agent&apos;s{" "}
            <span className="font-medium text-foreground">Model &amp; key</span> tab.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
