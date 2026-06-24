import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full max-w-xs" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>
    </div>
  );
}
