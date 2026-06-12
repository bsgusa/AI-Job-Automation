"use client";

import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { IntakeData } from "@/types/immigration";
import { StepNav } from "./shared";

interface Props {
  intake: IntakeData;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
}

function Row({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex gap-3 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-gray-500 w-40 shrink-0">{label}</span>
      <span className="text-xs text-gray-300">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#07040f] rounded-xl p-4 mb-4">
      <p className="text-sm font-semibold text-purple-300 mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function ReviewStep({
  intake,
  onBack,
  onSubmit,
  submitting,
  error,
}: Props) {
  const { petitioner: p, beneficiary: b, marriage: m, background: bg, financial: f } = intake;

  const warnings: string[] = [];
  if (bg.everArrestedPetitioner || bg.everArrestedBeneficiary)
    warnings.push("Criminal history detected — ensure police clearance and disposition records are ready.");
  if (bg.everDeportedBeneficiary || bg.everRemovedBeneficiary)
    warnings.push("Prior deportation/removal — this case may require attorney review.");
  if (bg.everViolatedImmigrationLaw)
    warnings.push("Immigration violations — prepare a detailed explanation letter.");
  if (
    f.petitionerAnnualIncome &&
    f.petitionerAnnualIncome < 24650 &&
    !f.hasJointSponsor
  )
    warnings.push("Income may be below the 125% FPG threshold — consider adding a joint sponsor.");
  if (!m.jointBankAccount && !m.jointLease && !m.cohabitation && !m.jointAssets)
    warnings.push("Limited bona fide marriage evidence — gather additional documentation.");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Review Your Information</h2>
      <p className="text-sm text-gray-400 mb-6">
        Please review the details below before generating your packet. You can go
        back to any section to make corrections.
      </p>

      {warnings.length > 0 && (
        <div className="mb-5 space-y-2">
          {warnings.map((w) => (
            <div
              key={w}
              className="flex gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">{w}</p>
            </div>
          ))}
        </div>
      )}

      <Section title="Petitioner">
        <Row label="Name" value={`${p.givenName} ${p.familyName}`} />
        <Row label="Date of Birth" value={p.dateOfBirth} />
        <Row label="Citizenship" value={`USC by ${p.usCitizenshipHow}`} />
        <Row label="Address" value={`${p.address.street}, ${p.address.city}, ${p.address.state}`} />
        <Row label="Phone" value={p.phone} />
        <Row label="Email" value={p.email} />
        <Row label="Prior marriages" value={String(p.priorMarriagesCount)} />
      </Section>

      <Section title="Beneficiary">
        <Row label="Name" value={`${b.givenName} ${b.familyName}`} />
        <Row label="Date of Birth" value={b.dateOfBirth} />
        <Row label="Country of Birth" value={b.countryOfBirth} />
        <Row label="Citizenship" value={b.countryOfCitizenship} />
        <Row label="Current Status" value={b.currentImmigrationStatus} />
        <Row label="Last Entry" value={b.dateOfLastEntry} />
        <Row label="I-94 Number" value={b.i94Number} />
        <Row label="Passport" value={b.passportNumber} />
        <Row label="Address" value={`${b.currentAddress.street}, ${b.currentAddress.city}`} />
        <Row label="Prior marriages" value={String(b.priorMarriagesCount)} />
      </Section>

      <Section title="Marriage">
        <Row label="Date" value={m.marriageDate} />
        <Row label="Location" value={`${m.marriageCity}, ${m.marriageCountry}`} />
        <Row label="Ceremony" value={m.ceremonyType} />
        <Row label="Joint bank account" value={m.jointBankAccount ? "Yes" : "No"} />
        <Row label="Joint lease/mortgage" value={m.jointLease ? "Yes" : "No"} />
        <Row label="Cohabitation" value={m.cohabitation ? "Yes" : "No"} />
      </Section>

      <Section title="Financial">
        <Row label="Employment" value={f.petitionerEmploymentStatus} />
        <Row label="Annual income" value={f.petitionerAnnualIncome ? `$${f.petitionerAnnualIncome.toLocaleString()}` : undefined} />
        <Row label="Household size" value={String(f.petitionerHouseholdSize)} />
        <Row label="Joint sponsor" value={f.hasJointSponsor ? `Yes — ${f.jointSponsorName}` : "No"} />
      </Section>

      {/* Final confirm */}
      <div className="bg-[#07040f] border border-purple-500/20 rounded-xl p-4 mb-4">
        <div className="flex gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">What happens next</p>
        </div>
        <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
          <li>Claude analyzes your case and generates personalized guidance</li>
          <li>Official USCIS I-130, I-485, and I-864 PDFs are filled with your data</li>
          <li>Document checklist and RFE risk report are generated</li>
          <li>Step-by-step filing instructions are prepared</li>
          <li>All files are securely stored in your account</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Generation takes 1–3 minutes. Do not close this tab.
        </p>
      </div>

      {error && (
        <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-60 rounded-xl px-6 py-3 font-semibold text-sm transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Packet…
            </>
          ) : (
            "Generate My Packet →"
          )}
        </button>
      </div>
    </div>
  );
}
