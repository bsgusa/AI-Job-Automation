import { Suspense } from "react";
import SuccessView from "@/components/immigration/SuccessView";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#07040f] text-white">
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto border-b border-white/5">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
          Lexora AI
        </span>
      </nav>
      <Suspense fallback={<div className="flex items-center justify-center h-96 text-gray-500">Loading…</div>}>
        <SuccessView />
      </Suspense>
    </main>
  );
}
