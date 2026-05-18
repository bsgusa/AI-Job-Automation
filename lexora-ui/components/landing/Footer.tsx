"use client";

import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const links = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Cookies", "GDPR"],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-violet-500/10 py-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white">
                Lex<span className="gradient-text">ora</span>
              </span>
            </div>
            <p className="text-sm text-purple-200/45 leading-relaxed max-w-xs mb-6">
              AI-powered job automation that applies, tailors, and tracks — so you
              can focus on what matters.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl glass border border-violet-500/15 flex items-center justify-center text-purple-300/50 hover:text-violet-300 hover:border-violet-400/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-violet-400/60 uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-purple-200/45 hover:text-violet-300 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-violet-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-purple-200/30">
            © {new Date().getFullYear()} Lexora AI, Inc. All rights reserved.
          </p>
          <p className="text-xs text-purple-200/25">
            Built with ♥ to accelerate careers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
