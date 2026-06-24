import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { listChatbots } from "@/lib/chatbots";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "SupportAI | Dashboard",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const bots = await listChatbots(owner.ownerId);

  return (
    <SidebarProvider>
      <AppSidebar agentCount={bots.length} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
      <Toaster position="top-center" />
    </SidebarProvider>
  );
}
