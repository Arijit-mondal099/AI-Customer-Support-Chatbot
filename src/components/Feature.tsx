"use client";

import { motion } from "motion/react";

export const Feature = () => {
  const features = [
    {
      id: 1,
      title: "24/7 Availability",
      description: "Round-the-clock support without human limitations",
    },
    {
      id: 2,
      title: "Cost Reduction",
      description: "Reduce support costs by up to 60% with automated responses",
    },
    {
      id: 3,
      title: "Fast Response Time",
      description: "Instant answers to customer queries in milliseconds",
    },
    {
      id: 4,
      title: "Admin Controlled",
      description:
        "Lorem ipsum dolor, adipisci quisquam veritatis ratione animi.",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
      id="features"
      className="max-w-7xl mx-auto mb-32 px-2 text-center"
    >
      <h1 className="text-4xl font-bold text-zinc-900 mb-32">
        Why Businesses Choose Support<span className="text-zinc-400">AI</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -20 }}
            transition={{ type: "spring", bounce: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            key={f.id}
            className="p-6 rounded-2xl border border-gray-200 shadow-lg flex flex-col justify-center gap-4 text-left"
          >
            <h2 className="text-xl font-semibold text-zinc-800">{f.title}</h2>
            <p className="text-sm font-medium text-zinc-500">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
