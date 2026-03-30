"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon, BoltIcon, ShieldCheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BoltIcon as BoltSolidIcon } from "@heroicons/react/24/solid";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

  return (
    <section ref={ref} className="relative min-h-[140vh] flex flex-col items-center pt-52 overflow-hidden bg-surface-50">
      {/* Background Parallax Patterns */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[100px]" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-6 text-center max-w-5xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 text-primary text-sm font-semibold mb-8 border border-primary/10">
            <BoltSolidIcon className="w-4 h-4" />
            <span>AI Navigation GPS</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-text-900 tracking-tight leading-[1.05] mb-8">
            The <span className="text-gradient">Minimap</span> for <br />
            your AI Conversations
          </h1>

          <p className="text-xl text-text-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Every thought mapped. See your whole chat at a glance. Navigate seamlessly through ChatGPT, Gemini, and Claude with visual context.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-24">
            <Link
              href="/assets/navis-extension.zip"
              download
              className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 flex items-center gap-3 hover:scale-[1.02] transition-transform"
            >
              Download Extension <ChevronRightIcon className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="px-10 py-5 glass text-text-900 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-surface-100 transition-colors"
            >
              How it works
            </Link>
          </div>
        </motion.div>

        {/* Parallax Mockup Frame */}
        <motion.div
          style={{ y, scale, opacity }}
          className="relative max-w-[1000px] mx-auto rounded-3xl overflow-hidden shadow-[0_48px_120px_rgba(0,26,255,0.12)] border border-primary/10 bg-white"
        >
          <Image
            src="/assets/mockup.png"
            alt="Navis interface overview"
            width={1200}
            height={800}
            priority
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-500 text-sm font-medium"
      >
        <span>Scroll to explore</span>
        <div className="w-1 h-12 rounded-full bg-accent relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 48, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full h-1/4 bg-primary rounded-full absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
