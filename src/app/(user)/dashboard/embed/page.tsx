import { Embed } from "@/components/Embed";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getUserSession } from "@/lib/getUserSession";

const EmbedPage = async () => {
  const section = await getUserSession();

  return (
    <>
      <Navbar email={section?.user?.email || ""} />
      <Embed ownerId={section?.user?.id || ""} />
      <Footer />
    </>
  );
};

export default EmbedPage;
