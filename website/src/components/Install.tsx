"use client";

import { motion } from "framer-motion";
import { ArrowDownTrayIcon, FolderOpenIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const steps = [
  {
    icon: <ArrowDownTrayIcon className="w-6 h-6" />,
    title: "Download",
    desc: "Get the extension ZIP and extract the folder to your local drive."
  },
  {
    icon: <FolderOpenIcon className="w-6 h-6" />,
    title: "Open Chrome",
    desc: "In Chrome, go to chrome://extensions and enable 'Developer Mode'."
  },
  {
    icon: <CursorArrowRaysIcon className="w-6 h-6" />,
    title: "Load Unpacked",
    desc: "Click 'Load unpacked' and select the folder you extracted."
  }
];

export default function Install() {
  return (
    <section className="py-32 bg-surface-50 overflow-hidden relative">
      {/* Decorative circle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[64px] bg-white p-12 md:p-24 shadow-[0_64px_160px_rgba(0,26,255,0.08)] border border-primary/5 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black text-text-900 mb-8 tracking-tight">
                Get Navis <br />
                Ready to Go.
              </h2>
              <p className="text-xl text-text-500 mb-12 leading-relaxed">
                Navis is modern. Manual installation takes 60 seconds and gives you immediate access to your data GPS.
              </p>
              
              <Link 
                href="/assets/navis-extension.zip" 
                download
                className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-white rounded-3xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
              >
                Download ZIP <ArrowDownTrayIcon className="w-5 h-5" />
              </Link>
              
              <div className="mt-16 flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-text-900">MV3</span>
                  <span className="text-sm font-semibold text-text-500 uppercase tracking-widest">Manifest</span>
                </div>
                <div className="w-[1px] h-10 bg-primary/20" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-text-900">All OS</span>
                  <span className="text-sm font-semibold text-text-500 uppercase tracking-widest">Support</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex flex-col gap-8">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex gap-6 items-start p-8 rounded-3xl bg-surface-50 border border-primary/5 hover:border-primary/20 transition-all group hover:bg-white hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-900 mb-3">{step.title}</h3>
                    <p className="text-text-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="text-2xl font-black text-text-900 tracking-tight">ChatGPT</div>
           <div className="text-2xl font-black text-text-900 tracking-tight">Gemini</div>
           <div className="text-2xl font-black text-text-900 tracking-tight">Claude</div>
        </div>
      </div>
    </section>
  );
}
