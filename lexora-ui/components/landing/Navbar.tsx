"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 80], [0, 24]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 30));
    return unsub;
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-4"
    >
      <div
        className={`rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "glass border border-purple-500/20 shadow-[0_8px_32px_rgba(139,92,246,0.15)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2.5 group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Lex<span className="gradient-text">ora</span>
          </span>
        </motion.a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-purple-200/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200"
              whileHover={{ y: -1 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm text-purple-300 hover:text-white transition-colors duration-200 px-4 py-2"
          >
            Sign In
          </a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(139,92,246,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            Get Started Free
          </motion.a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-purple-300 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 rounded-2xl glass border border-purple-500/20 p-4 flex flex-col gap-2 md:hidden"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm text-purple-200/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-purple-500/10 pt-3 mt-1 flex flex-col gap-2">
            <a href="#" className="px-4 py-2.5 text-sm text-purple-300 text-center">
              Sign In
            </a>
            <a
              href="#"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center bg-gradient-to-r from-violet-600 to-indigo-600"
            >
              Get Started Free
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
