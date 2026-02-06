import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Feature } from "@/components/Feature";
import { getUserSession } from "@/lib/getUserSession";

const HomePage = async () => {
  const session = await getUserSession();

  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-100 via-zinc-50 to-amber-50 text-zinc-900 overflow-x-hidden">
      <Navbar email={session?.user?.email ? session?.user?.email : null} />
      <Hero email={session?.user?.email ? session?.user?.email : null} />
      <Feature />
    </div>
  );
};

export default HomePage;
