import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Setting } from "@/components/Setting";
import { getUserSession } from "@/lib/getUserSession";

export const metadata = {
  title: "SupportAI | Dashboard",
};

const DashboardPage = async () => {
  const session = await getUserSession();

  return (
    <>
      <Navbar email={session?.user?.email} />
      <Setting ownerId={session?.user?.id || ""} supportEmail={session?.user?.email || ""} />
      <Footer />
    </>
  );
};

export default DashboardPage;
