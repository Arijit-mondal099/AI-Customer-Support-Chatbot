"use client";

import { LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Navbar = ({ email }: { email: string | null | undefined }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleLogin = (): void => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = (): void => {
    window.location.href = "/api/auth/logout";
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node))
        setIsOpen(false);
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      className="fixed z-50 top-0 left-0 w-full bg-white/40 backdrop-blur-sm border-b border-zinc-200"
    >
      <nav className="max-w-7xl mx-auto px-2 py-4 flex items-center justify-between gap-4">
        <Link href="/">
          <h1 className="bg-linear-to-r from-zinc-950 to-zinc-500 text-2xl font-bold lg:font-extrabold bg-clip-text text-transparent">
            Support<span className="text-zinc-400">AI</span>
          </h1>
        </Link>

        {email ? (
          pathname === "/dashboard" ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }} 
              className="bg-gray-50 text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
            >
              Embed Chatbot
            </motion.button>
          ) : (
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                ref={popupRef}
              >
                <p className="text-white text-sm font-semibold uppercase">
                  {email?.at(0)}
                </p>
              </motion.div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
                    className="absolute -bottom-24 right-0 z-50 w-44 bg-gray-50 rounded-lg border border-gray-200 shadow flex flex-col overflow-hidden"
                  >
                    <Link
                      href={"/dashboard"}
                      className="text-left text-sm font-medium cursor-pointer p-3"
                    >
                      Dashboard
                    </Link>

                    <button
                      className="text-left text-sm font-medium text-red-500 cursor-pointer p-3 border-t border-gray-200 flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <span>Logout</span>
                      <LogOut className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="bg-zinc-900 text-white font-medium text-sm px-6 py-2 rounded-full cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </motion.button>
        )}
      </nav>
    </motion.header>
  );
};
