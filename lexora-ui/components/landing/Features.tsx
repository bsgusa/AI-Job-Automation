"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText, Zap, Target, Calendar, BarChart3, Shield,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Tailoring",
    description:
      "Automatically customize your resume for each job posting. Our AI analyzes job descriptions and rewrites your experience to match.",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.3)",
    delay: 0,
  },
  {
    icon: Zap,
    title: "Auto-Apply Engine",
    description:
      "Apply to hundreds of matching positions while you sleep. Our engine fills forms, uploads documents, and tracks every submission.",
    gradient: "from-indigo-500 to-blue-600",
    glow: "rgba(99,102,241,0.3)",
    delay: 0.1,
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description:
      "Stop scrolling endless boards. Lexora surfaces roles where your profile genuinely fits, ranked by your real probability of success.",
    gradient: "from-purple-500 to-pink-600",
    glow: "rgba(168,85,247,0.3)",
    delay: 0.2,
  },
  {
    icon: Calendar,
    title: "Interview Scheduling",
    description:
      "Sync your calendar, receive interview invites, and get AI-crafted talking points delivered before every call.",
    gradient: "from-cyan-500 to-teal-600",
    glow: "rgba(34,211,238,0.3)",
    delay: 0.3,
  },
  {
    icon: BarChart3,
    title: "Application Analytics",
    description:
      "Track open rates, response rates, and funnel performance. Know exactly which resume versions and titles are working.",
    gradient: "from-violet-600 to-indigo-600",
    glow: "rgba(139,92,246,0.3)",
    delay: 0.4,
  },
  {
    icon: Shield,
    title: "Cover Letter AI",
    description:
      "Generate personalized, compelling cover letters in seconds. Trained on thousands of successful applications at top companies.",
    gradient: "from-fuchsia-500 to-violet-600",
    glow: "rgba(217,70,239,0.3)",
    delay: 0.5,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: feature.delay,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative"
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `radial-gradient(ellipse at center, ${feature.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative glass-card rounded-2xl p-6 border border-white/[0.06] group-hover:border-violet-500/25 transition-colors duration-300 h-full">
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg`}
          style={{ boxShadow: `0 8px 24px ${feature.glow}` }}
        >
          <Icon className="w-5.5 h-5.5 text-white" strokeWidth={1.8} />
        </div>

        <h3 className="text-lg font-bold text-white/95 mb-2.5 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-sm text-purple-200/55 leading-relaxed">
          {feature.description}
        </p>

        {/* Bottom shimmer line on hover */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-400/0 to-transparent group-hover:via-violet-400/40 transition-all duration-500" />
      </div>
    </motion.div>
  );
}

export default function Features() {
  const headRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-28 overflow-hidden">
      {/* Section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/20 text-xs font-medium text-violet-400 mb-5"
          >
            <Zap className="w-3 h-3" />
            Everything You Need
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-black text-white/95 tracking-tight mb-5"
          >
            Supercharge your{" "}
            <span className="gradient-text">job search</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-xl mx-auto text-lg text-purple-200/55"
          >
            Six powerful modules work together to automate every step of your
            journey from application to offer.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
    </section>
  );
}
