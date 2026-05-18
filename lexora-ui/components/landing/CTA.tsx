"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl p-12 overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-indigo-900/40 to-purple-900/60 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-violet-500/25 rounded-3xl" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-xs font-medium text-violet-300 mb-6"
            >
              <Sparkles className="w-3 h-3" />
              Start Today — Free Forever
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl font-black text-white/95 tracking-tight mb-5"
            >
              Your next job is{" "}
              <span className="gradient-text">one click away</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="text-purple-200/60 text-lg max-w-xl mx-auto mb-10"
            >
              Join 12,000+ professionals accelerating their career with AI.
              No credit card required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(139,92,246,0.6)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 text-base"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <span className="text-sm text-purple-300/40">
                No credit card · Cancel anytime
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
