"use client";

import { motion } from "motion/react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      className="fixed z-50 top-0 left-0 w-full bg-white/70 backdrop-blur-lg border-b border-zinc-200"
    >
      <nav className="max-w-7xl mx-auto px-2 py-4 flex items-center justify-between gap-4">
        <Link href="/">
          <h1 className="bg-linear-to-r from-zinc-900 to-zinc-500 text-2xl font-bold lg:font-extrabold bg-clip-text text-transparent">
            Support<span className="text-orange-500">.ai</span>
          </h1>
        </Link>

        <button className="bg-zinc-900 text-white font-medium text-sm px-6 py-2 rounded-full">
          Login
        </button>
      </nav>
    </motion.header>
  );
};
