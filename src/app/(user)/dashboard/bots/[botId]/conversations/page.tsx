import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { getChatbot } from "@/lib/chatbots";
import { ConversationsView } from "@/components/dashboard/ConversationsView";

export default async function BotConversationsPage({
  params,
}: {
  params: Promise<{ botId: string }>;
}) {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  const { botId } = await params;
  const bot = await getChatbot(owner.ownerId, botId);
  if (!bot) redirect("/dashboard");

  return <ConversationsView botId={bot._id} />;
}
