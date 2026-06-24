import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-[600px] flex-col rounded-xl border border-border">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-5">
        <div className="flex justify-start">
          <Skeleton className="h-12 w-3/5 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-2/5 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-1/2 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-12 w-2/3 rounded-2xl rounded-bl-sm" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-border p-4">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      </div>
    </div>
  );
}
