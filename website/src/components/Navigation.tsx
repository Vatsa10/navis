"use client";

import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-3 rounded-3xl glow-blue">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/logo.png" alt="Navis Logo" width={32} height={32} className="drop-shadow-[0_0_8px_rgba(0,26,255,0.2)]" />
          <span className="font-bold text-xl tracking-tight text-text-900">Navis</span>
        </Link>

        {/* Center Links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
          <Link href="#features" className="text-text-500 hover:text-primary transition-colors font-semibold text-sm uppercase tracking-wider">Features</Link>
          <Link href="#install" className="text-text-500 hover:text-primary transition-colors font-semibold text-sm uppercase tracking-wider">Setup</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/Vatsa10/navis"
            target="_blank"
            className="flex items-center gap-2 text-text-500 hover:text-primary transition-colors font-medium border-r border-primary/10 pr-6 mr-0"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            <span className="hidden lg:inline">GitHub</span>
          </Link>
          <Link
            href="/assets/navis-extension.zip"
            download
            className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Install
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
