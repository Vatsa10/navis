"use client";

import { motion } from "framer-motion";
import { ViewColumnsIcon, MagnifyingGlassIcon, EyeIcon, ShieldCheckIcon, BoltIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const features = [
  {
    icon: <ViewColumnsIcon className="text-primary w-7 h-7" />,
    title: "Visual Minimap",
    description: "Your conversation as a vertical bird's-eye view. Proportional bars to find long messages instantly."
  },
  {
    icon: <MagnifyingGlassIcon className="text-primary w-7 h-7" />,
    title: "Hover & Navigate",
    description: "Hover to preview whole chunks of text and click any bar to scroll directly to any message."
  },
  {
    icon: <BoltIcon className="text-primary w-7 h-7" />,
    title: "Instant Setup",
    description: "Manual installation in seconds. Get started without waiting for Web Store review cycles."
  },
  {
    icon: <ShieldCheckIcon className="text-primary w-7 h-7" />,
    title: "Zero Data Terms",
    description: "Privacy-first. All processing is 100% local in your browser. No external requests. Ever."
  },
  {
    icon: <EyeIcon className="text-primary w-7 h-7" />,
    title: "Focus Map",
    description: "The minimap highlights exactly where you are in the chat so you never lose context."
  },
  {
    icon: <GlobeAltIcon className="text-primary w-7 h-7" />,
    title: "Multi-Platform",
    description: "Works flawlessly on ChatGPT, Gemini, and Claude. One extension, all your AI chats."
  }
];

export default function Features() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-text-900 mb-6"
          >
            Built for <span className="text-gradient">Power Context</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-500"
          >
            Designed for high-intensity AI workflows where context is everything.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-10 rounded-[32px] bg-surface-50 border border-primary/5 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md mb-8 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-text-900 mb-4">{feature.title}</h3>
              <p className="text-text-500 leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
