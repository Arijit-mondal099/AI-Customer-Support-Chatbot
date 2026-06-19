import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { listChatbots } from "@/lib/chatbots";
import { AgentsGrid } from "@/components/dashboard/AgentsGrid";

export default async function AgentsPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const bots = await listChatbots(owner.ownerId);
  return <AgentsGrid bots={bots} />;
}
