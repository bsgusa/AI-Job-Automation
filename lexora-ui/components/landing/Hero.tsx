"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 12,
    size: 1 + Math.random() * 2,
    opacity: 0.2 + Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-violet-400"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -window?.innerHeight ?? -900],
            opacity: [0, p.opacity, p.opacity * 0.5, 0],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function OrbBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Main glow orb */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Outer ring */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full border border-violet-500/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_12px_4px_rgba(167,139,250,0.6)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_3px_rgba(129,140,248,0.5)]" />
      </motion.div>
      {/* Middle ring */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full border border-indigo-500/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_4px_rgba(34,211,238,0.5)]" />
      </motion.div>
      {/* Inner core glow */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="absolute inset-0 spotlight" />
      <OrbBackground />
      {!shouldReduce && <Particles />}

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent"
          animate={{ y: ["0vh", "100vh"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/25 text-xs font-medium text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>AI-Powered Job Automation Platform</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-semibold">NEW</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
        >
          <span className="block text-white/95">Land Your</span>
          <span className="block gradient-text mt-1">Dream Job</span>
          <span className="block text-white/95 mt-1">With AI</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="max-w-2xl mx-auto text-lg sm:text-xl text-purple-200/60 leading-relaxed mb-10"
        >
          Lexora automates your entire job search — from tailoring resumes and
          crafting cover letters to tracking applications and scheduling interviews.
          <span className="text-violet-300/80"> Apply 10× faster, get noticed 3× more.</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="#"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(99,102,241,0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 text-base"
          >
            Start For Free
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.a>

          <motion.a
            href="#"
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.06)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-purple-200 glass border border-purple-500/20 hover:border-purple-400/30 transition-all duration-300 text-base"
          >
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Play className="w-3 h-3 text-violet-300 fill-violet-300 ml-0.5" />
            </div>
            Watch Demo
          </motion.a>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-purple-200/50"
        >
          {[
            { value: "50K+", label: "Jobs Applied" },
            { value: "12K+", label: "Offers Received" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2">
              {i > 0 && <span className="hidden sm:block w-px h-4 bg-purple-500/20" />}
              <span className="font-bold text-violet-300">{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview hint */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-t from-violet-900/20 to-transparent rounded-3xl blur-xl" />
          <div className="relative glass-card rounded-3xl border border-violet-500/15 p-1 shadow-[0_20px_80px_rgba(139,92,246,0.15)]">
            <div className="rounded-2xl overflow-hidden bg-[#0a0618] aspect-[16/6] flex items-center justify-center">
              {/* Mock dashboard */}
              <div className="w-full h-full p-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Applications Sent", value: "247", change: "+18 today", color: "from-violet-600 to-purple-600" },
                  { label: "Interview Rate", value: "34%", change: "+12% vs avg", color: "from-indigo-600 to-blue-600" },
                  { label: "Offers Received", value: "8", change: "This month", color: "from-cyan-600 to-teal-600" },
                ].map((card) => (
                  <div key={card.label} className="glass-card rounded-xl p-4 border border-white/5">
                    <div className={`text-xs text-purple-300/60 mb-1`}>{card.label}</div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.value}
                    </div>
                    <div className="text-xs text-green-400/70 mt-1">{card.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07040f] to-transparent rounded-b-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
