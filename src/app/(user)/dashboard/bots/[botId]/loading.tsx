import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Renders in the content area — inside the bot layout on tab switches (header +
// tabs persist), and standalone on first load. Content-only to avoid duplicating
// the header/tabs.
export default function Loading() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
