"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, MoreVertical, Plus, Settings2, Trash2 } from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { apiClient } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
const NewAgentButton = () => (
  <Button render={<Link href="/dashboard/agents/new" />} nativeButton={false}>
    <Plus className="h-4 w-4" /> New agent
  </Button>
);

export function AgentsGrid({ bots }: { bots: SerializedBot[] }) {
  const router = useRouter();
  const [items, setItems] = useState(bots);
  const [pending, setPending] = useState<SerializedBot | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      const { data } = await apiClient.delete(`/api/chatbots/${pending._id}`);
      if (data.success) {
        setItems((prev) => prev.filter((b) => b._id !== pending._id));
        setPending(null);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground">Create and manage your AI support agents.</p>
        </div>
        <NewAgentButton />
      </div>

      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bot size={22} />
          </div>
          <CardTitle className="text-base">No agents yet</CardTitle>
          <p className="mb-4 mt-1 max-w-xs text-sm text-muted-foreground">
            Create your first agent to start answering customers.
          </p>
          <NewAgentButton />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <Card key={b._id} className="gap-0">
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <Bot size={18} />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">{b.name}</CardTitle>
                    <p className="truncate text-xs text-muted-foreground">
                      {b.businessInfo.businessName || b.botInfo.botName || "Untitled"}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={`/dashboard/bots/${b._id}`} />}>
                      <Settings2 className="mr-2 h-4 w-4" /> Manage
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPending(b)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="mt-4 flex items-center justify-between">
                {b.status === "live" ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-300 bg-emerald-50 text-emerald-700"
                  >
                    live
                  </Badge>
                ) : (
                  <Badge variant="secondary">draft</Badge>
                )}
                <Button
                  render={<Link href={`/dashboard/bots/${b._id}`} />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open && !deleting) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pending?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the agent, its knowledge base, and all conversations. This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
