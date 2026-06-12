"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Shield, Zap, ArrowRight, Star } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Prefilled I-130 + I-485 PDFs",
    description:
      "Official USCIS forms filled using your intake data. Download and mail — no blank PDFs to struggle with.",
  },
  {
    icon: Zap,
    title: "AI-Guided Questionnaire",
    description:
      "Claude analyzes your situation in real time, flagging issues and answering questions as you fill out each section.",
  },
  {
    icon: Shield,
    title: "RFE Risk Analysis",
    description:
      "Identifies common Request for Evidence triggers specific to your case before you file.",
  },
  {
    icon: CheckCircle,
    title: "Personalized Document Checklist",
    description:
      "Exact list of supporting documents needed, tailored to your immigration history and financial situation.",
  },
];

const WHATS_INCLUDED = [
  "Filled Form I-130 (Petition for Alien Relative)",
  "Filled Form I-485 (Application to Adjust Status)",
  "Filled Form I-864 (Affidavit of Support)",
  "Personalized document checklist",
  "RFE risk analysis report",
  "Step-by-step filing instructions",
  "AI guidance on every question",
  "Lifetime access to your case documents",
];

export default function ApplyPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Failed to start checkout");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07040f] text-white">
      {/* Header */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
          Lexora AI
        </span>
        <a
          href="/"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to home
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-sm text-purple-300">Marriage Green Card Package</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            File Your Marriage Green Card{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Lexora AI guides you through the entire I-130 + I-485 process,
            pre-fills official USCIS forms, and flags RFE risks — all for a
            flat fee. No hourly billing, no surprises.
          </p>

          {/* Pricing card */}
          <div className="bg-[#0d0820] border border-purple-500/20 rounded-2xl p-6 mb-6">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-5xl font-bold">$399</span>
              <span className="text-gray-400 mb-2">one-time</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              vs. $3,000–$8,000 at a law firm
            </p>

            <div className="space-y-2 mb-6">
              {WHATS_INCLUDED.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <input
              type="email"
              placeholder="Email (optional — for receipt)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#07040f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-purple-500/50"
            />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-60 rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                "Redirecting to checkout..."
              ) : (
                <>
                  Get Started — $399 <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Secured by Stripe · 30-day money-back guarantee
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Lexora AI provides document preparation assistance, not legal advice.
            For complex immigration situations, consult a licensed attorney.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-5"
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 bg-[#0d0820] border border-white/5 rounded-xl p-5"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}

          {/* Trust badge */}
          <div className="bg-[#0d0820] border border-white/5 rounded-xl p-5">
            <p className="text-sm text-gray-400 italic leading-relaxed">
              "Lexora walked us through every section, caught that my husband's
              prior visa was expired, and generated our full packet in minutes.
              Our attorney reviewed and said it was filing-ready."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300">
                MR
              </div>
              <div>
                <p className="text-sm font-medium">Maria R.</p>
                <p className="text-xs text-gray-500">Filed I-130 + I-485 · Texas</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
