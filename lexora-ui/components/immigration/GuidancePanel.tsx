"use client";

import { useState } from "react";
import { Sparkles, Send, ChevronDown, ChevronUp } from "lucide-react";
import type { IntakeData, IntakeStep } from "@/types/immigration";

const STEP_HINTS: Record<IntakeStep, string[]> = {
  petitioner: [
    "What documents prove U.S. citizenship?",
    "Do I need to list my middle name?",
    "What if I was naturalized through my parents?",
  ],
  beneficiary: [
    "Where do I find my I-94 number?",
    "What if my beneficiary is out of status?",
    "What visa class should I list?",
  ],
  marriage: [
    "What evidence proves a bona fide marriage?",
    "Do we need witnesses listed on the form?",
    "We just got married — is that okay?",
  ],
  background: [
    "What counts as an immigration violation?",
    "Does a traffic ticket need to be listed?",
    "My spouse overstayed a visa — what happens?",
  ],
  financial: [
    "How do I calculate my household size?",
    "What if my income is below the threshold?",
    "Can my employer verification letter substitute for a pay stub?",
  ],
  review: [
    "What order should I stack the packet?",
    "Do I need to sign in blue or black ink?",
    "Where do I mail the I-130 + I-485 together?",
  ],
};

interface Props {
  step: IntakeStep;
  intake: IntakeData;
}

export default function GuidancePanel({ step, intake }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  async function ask(q: string) {
    setQuestion(q);
    setAnswer("");
    setLoading(true);
    try {
      const res = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, question: q, partialIntake: intake }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? data.error ?? "No response.");
    } catch {
      setAnswer("Failed to get guidance — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hints = STEP_HINTS[step] ?? [];

  return (
    <div className="bg-[#0d0820] border border-purple-500/20 rounded-2xl overflow-hidden self-start sticky top-6">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-300">
            AI Guidance
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="p-4 pt-0">
          {/* Answer area */}
          {(answer || loading) && (
            <div className="mb-4 bg-purple-500/5 border border-purple-500/15 rounded-xl p-3">
              {loading ? (
                <div className="flex gap-1 items-center text-gray-500 text-xs">
                  <span className="animate-pulse">Thinking</span>
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-purple-300 font-medium mb-1 italic">
                    Q: {question}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">{answer}</p>
                </>
              )}
            </div>
          )}

          {/* Suggested questions */}
          {!loading && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Common questions:</p>
              <div className="space-y-1.5">
                {hints.map((hint) => (
                  <button
                    key={hint}
                    onClick={() => ask(hint)}
                    className="w-full text-left text-xs text-gray-400 hover:text-white bg-white/3 hover:bg-white/8 border border-white/5 rounded-lg px-3 py-2 transition-colors leading-snug"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom question input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && question.trim() && ask(question)}
              className="flex-1 min-w-0 bg-[#07040f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
            />
            <button
              onClick={() => question.trim() && ask(question)}
              disabled={!question.trim() || loading}
              className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-lg transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-3">
            General guidance only — not legal advice.
          </p>
        </div>
      )}
    </div>
  );
}
