import { Suspense } from "react";
import IntakeWizard from "@/components/immigration/IntakeWizard";

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-[#07040f] text-white">
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto border-b border-white/5">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
          Lexora AI
        </span>
        <span className="text-sm text-gray-500">Marriage Green Card Intake</span>
      </nav>
      <Suspense fallback={<div className="flex items-center justify-center h-96 text-gray-500">Loading…</div>}>
        <IntakeWizard />
      </Suspense>
    </main>
  );
}
