import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { CreateAgentWizard } from "@/components/dashboard/CreateAgentWizard";

export default async function NewAgentPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  return <CreateAgentWizard />;
}
