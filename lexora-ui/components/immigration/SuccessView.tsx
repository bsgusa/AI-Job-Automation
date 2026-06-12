"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  AlertTriangle,
  FileText,
  ListChecks,
  BookOpen,
  Loader2,
} from "lucide-react";
import type { ChecklistItem, RFERisk } from "@/types/immigration";

interface SuccessData {
  caseId: string;
  checklist: ChecklistItem[];
  rfeRisks: RFERisk[];
  filingInstructions: string;
  downloadUrls: { name: string; url: string }[];
  pdfErrors: string[];
}

const RISK_COLORS = {
  low: "text-green-300 bg-green-500/10 border-green-500/20",
  medium: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  high: "text-red-300 bg-red-500/10 border-red-500/20",
};

const CATEGORY_COLORS: Record<ChecklistItem["category"], string> = {
  identity: "bg-blue-500/10 text-blue-300",
  marriage: "bg-pink-500/10 text-pink-300",
  financial: "bg-green-500/10 text-green-300",
  immigration: "bg-orange-500/10 text-orange-300",
  photos: "bg-purple-500/10 text-purple-300",
  other: "bg-gray-500/10 text-gray-300",
};

export default function SuccessView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [data, setData] = useState<SuccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"downloads" | "checklist" | "risks" | "instructions">(
    "downloads"
  );

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Poll for case completion (packet generation may still be in progress)
    const poll = async () => {
      const { supabase } = await import("@/lib/supabase");
      const { data: rows } = await supabase.rpc("get_case_by_session", {
        p_session_id: sessionId,
      });

      const row = rows?.[0];
      if (!row) {
        setLoading(false);
        return;
      }

      if (row.status === "complete") {
        // Build SuccessData from the case row
        const signedUrls: { name: string; url: string }[] = [];
        if (row.generated_packet_path) {
          const forms = [
            "I-130_Petition_for_Alien_Relative.pdf",
            "I-485_Application_to_Register_Permanent_Residence.pdf",
            "I-864_Affidavit_of_Support.pdf",
          ];
          for (const name of forms) {
            const { data: signed } = await supabase.storage
              .from("case-documents")
              .createSignedUrl(`${row.generated_packet_path}/${name}`, 3600 * 24);
            if (signed?.signedUrl) {
              signedUrls.push({ name, url: signed.signedUrl });
            }
          }
        }
        setData({
          caseId: row.id,
          checklist: row.checklist ?? [],
          rfeRisks: row.rfe_risks ?? [],
          filingInstructions: row.filing_instructions ?? "",
          downloadUrls: signedUrls,
          pdfErrors: [],
        });
        setLoading(false);
      } else if (row.status === "generating" || row.status === "intake_complete") {
        // Still generating — poll again in 4 seconds
        setTimeout(poll, 4000);
      } else {
        setLoading(false);
      }
    };

    poll();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        <p className="text-gray-400 text-sm">Generating your packet…</p>
        <p className="text-gray-600 text-xs">This takes 1–3 minutes. Do not close this tab.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-lg mx-auto px-6 pt-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Case Not Found</h2>
        <p className="text-gray-400 text-sm">
          We couldn't load your case. Please contact support with your session ID:{" "}
          <code className="text-purple-300">{sessionId}</code>
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "downloads" as const, label: "Downloads", icon: Download },
    { id: "checklist" as const, label: `Checklist (${data.checklist.length})`, icon: ListChecks },
    { id: "risks" as const, label: `RFE Risks (${data.rfeRisks.length})`, icon: AlertTriangle },
    { id: "instructions" as const, label: "Filing Guide", icon: BookOpen },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Success header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
          <CheckCircle className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Your Packet Is Ready</h1>
        <p className="text-gray-400">
          Your personalized I-130 + I-485 package has been generated. Download
          your forms below and follow the filing guide.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0d0820] p-1 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[#0d0820] border border-white/5 rounded-2xl p-6">
        {activeTab === "downloads" && (
          <div>
            <h2 className="text-base font-semibold mb-4">Your USCIS Forms</h2>
            {data.downloadUrls.length === 0 ? (
              <p className="text-gray-500 text-sm">
                PDF downloads are not yet available. Please refresh in a moment.
              </p>
            ) : (
              <div className="space-y-3">
                {data.downloadUrls.map(({ name, url }) => (
                  <a
                    key={name}
                    href={url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between bg-[#07040f] border border-white/5 hover:border-purple-500/30 rounded-xl px-5 py-4 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <span className="text-sm">{name}</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </a>
                ))}
              </div>
            )}
            {data.pdfErrors.length > 0 && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-300 font-medium mb-1">
                  Some forms could not be pre-filled:
                </p>
                {data.pdfErrors.map((e) => (
                  <p key={e} className="text-xs text-gray-400">{e}</p>
                ))}
                <p className="text-xs text-gray-500 mt-2">
                  Download blank forms from uscis.gov and fill manually using the data you entered.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "checklist" && (
          <div>
            <h2 className="text-base font-semibold mb-4">Document Checklist</h2>
            <div className="space-y-3">
              {data.checklist.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#07040f] border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-0.5 accent-purple-500" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium">{item.item}</span>
                        {item.required && (
                          <span className="text-xs text-red-400 font-medium">Required</span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{item.description}</p>
                      {item.tip && (
                        <p className="text-xs text-gray-500 mt-1 italic">{item.tip}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "risks" && (
          <div>
            <h2 className="text-base font-semibold mb-1">RFE Risk Analysis</h2>
            <p className="text-sm text-gray-400 mb-4">
              Potential issues USCIS may flag in your case, and how to address them.
            </p>
            <div className="space-y-4">
              {data.rfeRisks.map((risk, i) => (
                <div
                  key={i}
                  className={`border rounded-xl p-4 ${RISK_COLORS[risk.riskLevel]}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">{risk.category}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_COLORS[risk.riskLevel]}`}
                    >
                      {risk.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-xs mb-2">{risk.reasoning}</p>
                  <p className="text-xs text-gray-300">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "instructions" && (
          <div>
            <h2 className="text-base font-semibold mb-4">Filing Instructions</h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-xs text-gray-300 leading-relaxed font-sans">
                {data.filingInstructions}
              </pre>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-600 mt-6">
        Need help? Email support@lexora.ai · Case ID: {data.caseId}
      </p>
    </div>
  );
}
