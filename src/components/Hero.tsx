"use client";

import { Bot, ChevronRight, Send } from "lucide-react";
import { motion } from "motion/react";

export const Hero = ({ email }: { email: string | null }) => {
  return (
    <section className="max-w-7xl mx-auto mt-32 pb-20 px-2 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
        className="w-full"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight w-full lg:max-w-xl">
          AI Coustomer Support Built for Modern Websites
        </h1>
        <p className="mt-6 text-lg text-zinc-500 font-medium max-w-lg">
          Enhance your customer service experience using cutting-edge AI
          technology designed to provide instant, accurate, and personalized
          support.
        </p>

        <div className="flex items-center gap-4">
          {email ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="mt-8 bg-zinc-900 text-white font-medium text-sm px-6 py-3 rounded-lg cursor-pointer hover:bg-zinc-800 transition shadow"
            >
              Go to Dashboard
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="mt-8 bg-zinc-900 text-white font-medium text-sm px-6 py-3 rounded-lg cursor-pointer hover:bg-zinc-800 transition shadow"
            >
              Get Started
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="mt-8 text-zinc-900 bg-gray-100 font-medium text-sm px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition border border-gray-200 shadow flex items-center gap-2"
          >
            <span>Learn more</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
        className="relative w-full flex justify-center lg:justify-end"
      >
        <div className="flex flex-col gap-3 bg-linear-to-b from-zinc-50 to-zinc-100 border border-zinc-200 rounded-xl p-4 space-y-4 max-w-lg w-full shadow-2xl">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              AI
            </div>
            <div className="bg-white rounded-lg p-3 max-w-xs border border-gray-200">
              <p className="text-sm text-zinc-700">
                Hello! How can I assist you today with your customer support
                needs?
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <div className="bg-zinc-900 text-white rounded-lg p-3 max-w-xs">
              <p className="text-sm">
                I need help integrating AI support into my website
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              AI
            </div>
            <div className="bg-white rounded-lg p-3 max-w-xs border border-gray-200">
              <p className="text-sm text-zinc-700">
                Great! Our platform makes it easy with just a few lines of code.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <button className="bg-zinc-900 text-white rounded-lg px-4 py-2 hover:bg-zinc-800 transition cursor-pointer">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -bottom-14 z-40 shadow-2xl shadow-amber-500 p-3 bg-zinc-900 text-white rounded-full"
        >
          <Bot />
        </motion.button>
      </motion.div>
    </section>
  );
};
