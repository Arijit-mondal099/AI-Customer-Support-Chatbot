"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./ConfirmDialog";

export const DeleteBotSection = ({ botId, botName }: { botId: string; botName: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { data } = await apiClient.delete(`/api/chatbots/${botId}`);
      if (data.success) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setDeleting(false);
  };

  return (
    <div className="mt-6 rounded-3xl border border-rose-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <AlertTriangle size={17} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Delete this chatbot</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Permanently removes <span className="font-medium text-slate-700">{botName}</span>, its
              knowledge base, and all conversations. This can&apos;t be undone.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <Trash2 size={13} /> Delete bot
        </button>
      </div>

      <ConfirmDialog
        open={open}
        loading={deleting}
        title="Delete chatbot?"
        message={
          <>
            This permanently removes <span className="font-medium text-slate-700">{botName}</span>,
            its knowledge base, and all conversations. This can&apos;t be undone.
          </>
        }
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
