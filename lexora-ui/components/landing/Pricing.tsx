"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    description: "Perfect for exploring AI-powered job search.",
    features: [
      "10 AI resume tailors / month",
      "20 auto-applications / month",
      "Basic job matching",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "from-violet-900/40 to-indigo-900/30",
    border: "border-violet-500/10",
    ctaStyle: "glass border border-violet-500/20 text-violet-300 hover:border-violet-400/40",
  },
  {
    name: "Pro",
    monthly: 29,
    annual: 19,
    description: "For serious job seekers ready to accelerate.",
    features: [
      "Unlimited resume tailoring",
      "500 auto-applications / month",
      "Priority job matching",
      "AI cover letters",
      "Interview scheduling",
      "Application analytics",
    ],
    cta: "Start Pro Trial",
    popular: true,
    gradient: "from-violet-800/50 to-indigo-800/40",
    border: "border-violet-400/30",
    ctaStyle:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]",
  },
  {
    name: "Elite",
    monthly: 79,
    annual: 59,
    description: "Maximum firepower for competitive markets.",
    features: [
      "Everything in Pro",
      "Unlimited applications",
      "Dedicated AI job coach",
      "Salary negotiation scripts",
      "LinkedIn profile optimization",
      "Priority 24/7 support",
    ],
    cta: "Go Elite",
    popular: false,
    gradient: "from-indigo-900/40 to-violet-900/30",
    border: "border-violet-500/10",
    ctaStyle: "glass border border-violet-500/20 text-violet-300 hover:border-violet-400/40",
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/20 text-xs font-medium text-violet-400 mb-5"
          >
            <Sparkles className="w-3 h-3" />
            Simple Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-black text-white/95 tracking-tight mb-5"
          >
            Invest in your{" "}
            <span className="gradient-text">career</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-md mx-auto text-purple-200/55 mb-8"
          >
            Start free, upgrade when you're ready. Cancel anytime — no questions asked.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 glass rounded-full px-2 py-2 border border-violet-500/15"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                !annual
                  ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  : "text-purple-200/60 hover:text-purple-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                annual
                  ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  : "text-purple-200/60 hover:text-purple-200"
              }`}
            >
              Annual
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">
                −35%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative rounded-2xl p-6 border ${plan.border} bg-gradient-to-b ${plan.gradient} flex flex-col backdrop-blur-xl`}
            >
              {plan.popular && (
                <>
                  {/* Popular badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)] whitespace-nowrap">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                  {/* Glow border */}
                  <div className="absolute inset-0 rounded-2xl border border-violet-400/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] pointer-events-none" />
                </>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-violet-400/80 uppercase tracking-widest mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white/95">
                    ${annual ? plan.annual : plan.monthly}
                  </span>
                  <span className="text-purple-300/50 mb-1.5">/mo</span>
                </div>
                {annual && plan.monthly > 0 && (
                  <div className="text-xs text-purple-300/40 line-through">
                    ${plan.monthly}/mo billed monthly
                  </div>
                )}
                <p className="text-sm text-purple-200/50 mt-2">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-purple-100/70">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
