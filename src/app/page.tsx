import { Navbar } from "@/components/Navbar";
import { getUserSession } from "@/lib/getUserSession";

const HomePage = async () => {
  const session = await getUserSession();

  return (
    <div className="relative min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden">
      <Navbar email={session?.user?.email ? session?.user?.email : null} />
    </div>
  );
};

export default HomePage;
