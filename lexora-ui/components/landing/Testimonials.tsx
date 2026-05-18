"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer → FAANG",
    avatar: "SC",
    color: "from-violet-500 to-purple-600",
    rating: 5,
    text: "I applied to 300+ jobs in 2 weeks with Lexora. Within a month I had 8 interviews and 3 offers. Absolutely insane ROI.",
  },
  {
    name: "Marcus Webb",
    role: "Product Manager",
    avatar: "MW",
    color: "from-indigo-500 to-blue-600",
    rating: 5,
    text: "The AI resume tailoring is magic. My response rate went from 4% to 31% after Lexora started customizing my applications.",
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist",
    avatar: "PS",
    color: "from-purple-500 to-pink-600",
    rating: 5,
    text: "Spent 6 months job searching manually with no luck. Lexora got me 3 offers in 45 days. I wish I found it sooner.",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-black text-white/95 tracking-tight mb-4"
          >
            Loved by <span className="gradient-text">job seekers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-purple-200/55"
          >
            Join 12,000+ professionals who found their dream role with Lexora.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 border border-white/[0.05] hover:border-violet-500/20 transition-colors duration-300"
            >
              <Quote className="w-6 h-6 text-violet-500/40 mb-4" />

              <p className="text-sm text-purple-100/75 leading-relaxed mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">{t.name}</div>
                  <div className="text-xs text-violet-400/60">{t.role}</div>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
