import { redirect } from "next/navigation";
import { KeyRound, LogOut, Mail } from "lucide-react";
import { requireOwner } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Your account.</p>
      </div>

      <Card>
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

      <Card>
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
