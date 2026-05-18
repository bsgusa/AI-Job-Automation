"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, Search, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Import your LinkedIn or upload your resume. Our AI builds a rich professional profile and identifies your strongest selling points.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.4)",
  },
  {
    step: "02",
    icon: Search,
    title: "Set Your Targets",
    description:
      "Tell Lexora your ideal roles, companies, locations, and salary range. Our engine continuously scans 200+ job boards and company sites.",
    color: "from-indigo-500 to-cyan-500",
    glow: "rgba(99,102,241,0.4)",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Automate & Accelerate",
    description:
      "Sit back while Lexora tailors your materials, submits applications, and manages follow-ups. You focus on preparing for interviews.",
    color: "from-purple-500 to-pink-500",
    glow: "rgba(168,85,247,0.4)",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-violet-900/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/20 text-xs font-medium text-violet-400 mb-5"
          >
            <Rocket className="w-3 h-3" />
            Simple 3-Step Process
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-black text-white/95 tracking-tight mb-5"
          >
            From signup to{" "}
            <span className="gradient-text">offer letter</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-xl mx-auto text-lg text-purple-200/55"
          >
            Most users receive their first interview request within 48 hours of setup.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[16.666%] right-[16.666%] h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500/50 via-indigo-500/50 to-purple-500/50"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
              style={{ originX: 0 }}
            />
            {/* Animated dot */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_4px_rgba(167,139,250,0.5)]"
              initial={{ left: "0%" }}
              animate={inView ? { left: "100%" } : {}}
              transition={{ delay: 1.2, duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 48 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.2 + i * 0.15,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative text-center lg:text-left"
                >
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center lg:items-start mb-6">
                    <div className="relative mb-4">
                      {/* Step circle */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}
                        style={{ boxShadow: `0 12px 32px ${step.glow}` }}
                      >
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                      </div>
                      {/* Pulse ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-30`}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
                      />
                    </div>

                    <span className="text-xs font-mono font-bold text-violet-400/60 tracking-widest mb-2">
                      STEP {step.step}
                    </span>
                    <h3 className="text-xl font-bold text-white/95 tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-purple-200/55 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
