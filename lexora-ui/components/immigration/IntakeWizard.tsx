"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import PetitionerStep from "./steps/PetitionerStep";
import BeneficiaryStep from "./steps/BeneficiaryStep";
import MarriageStep from "./steps/MarriageStep";
import BackgroundStep from "./steps/BackgroundStep";
import FinancialStep from "./steps/FinancialStep";
import ReviewStep from "./steps/ReviewStep";
import GuidancePanel from "./GuidancePanel";
import type { IntakeData, IntakeStep } from "@/types/immigration";

const STEPS: { id: IntakeStep; label: string }[] = [
  { id: "petitioner", label: "Petitioner" },
  { id: "beneficiary", label: "Beneficiary" },
  { id: "marriage", label: "Marriage" },
  { id: "background", label: "Background" },
  { id: "financial", label: "Financial" },
  { id: "review", label: "Review" },
];

const EMPTY_INTAKE: IntakeData = {
  petitioner: {
    familyName: "",
    givenName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    countryOfBirth: "",
    countryOfCitizenship: "United States",
    usCitizenshipHow: "birth",
    address: { street: "", city: "", country: "United States" },
    phone: "",
    email: "",
    priorMarriagesCount: 0,
  },
  beneficiary: {
    familyName: "",
    givenName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    countryOfBirth: "",
    countryOfCitizenship: "",
    currentAddress: { street: "", city: "", country: "" },
    phone: "",
    email: "",
    priorMarriagesCount: 0,
    childrenCount: 0,
    hasSSN: false,
  },
  marriage: {
    marriageDate: "",
    marriageCity: "",
    marriageCountry: "",
    ceremonyType: "civil",
    jointAssets: false,
    jointBankAccount: false,
    jointLease: false,
    cohabitation: false,
    sharedExpenses: false,
    hasChildren: false,
  },
  background: {
    everArrestedPetitioner: false,
    everArrestedBeneficiary: false,
    everDeportedBeneficiary: false,
    everRemovedBeneficiary: false,
    everDeniedVisaBeneficiary: false,
    everViolatedImmigrationLaw: false,
    hasPhysicalExam: false,
    everServedMilitaryPetitioner: false,
  },
  financial: {
    petitionerEmploymentStatus: "employed",
    petitionerHouseholdSize: 2,
    hasJointSponsor: false,
  },
};

export default function IntakeWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [currentStep, setCurrentStep] = useState<IntakeStep>("petitioner");
  const [intake, setIntake] = useState<IntakeData>(EMPTY_INTAKE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sessionVerified, setSessionVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setSessionVerified(false);
      return;
    }
    // Poll Supabase via RPC to verify payment
    import("@/lib/supabase").then(({ supabase }) => {
      supabase
        .rpc("get_case_by_session", { p_session_id: sessionId })
        .then(({ data, error }) => {
          if (error || !data || data.length === 0) {
            setSessionVerified(false);
          } else {
            const status = data[0]?.status;
            if (status === "paid" || status === "intake_complete") {
              setSessionVerified(true);
            } else if (status === "complete") {
              router.replace(`/apply/success?session_id=${sessionId}`);
            } else {
              setSessionVerified(false);
            }
          }
        });
    });
  }, [sessionId, router]);

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  function updateIntake(partial: Partial<IntakeData>) {
    setIntake((prev) => ({ ...prev, ...partial }));
  }

  function goNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
      window.scrollTo(0, 0);
    }
  }

  function goPrev() {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
      window.scrollTo(0, 0);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/generate-packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, intakeData: intake }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to generate packet");
        return;
      }
      router.push(`/apply/success?session_id=${sessionId}`);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sessionVerified === null) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Verifying payment…
      </div>
    );
  }

  if (sessionVerified === false) {
    return (
      <div className="max-w-md mx-auto px-6 pt-24 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Payment Not Found</h2>
        <p className="text-gray-400 mb-6 text-sm">
          We couldn't verify your payment. Please complete checkout first, or
          contact support if you believe this is an error.
        </p>
        <a
          href="/apply"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 rounded-xl px-6 py-3 font-medium transition-colors"
        >
          Return to Checkout
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => i <= currentIndex && setCurrentStep(step.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  i < currentIndex
                    ? "text-purple-400 cursor-pointer"
                    : i === currentIndex
                    ? "text-white"
                    : "text-gray-600 cursor-default"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${
                    i < currentIndex
                      ? "bg-purple-600 border-purple-600"
                      : i === currentIndex
                      ? "bg-purple-600/20 border-purple-500"
                      : "bg-transparent border-gray-700"
                  }`}
                >
                  {i < currentIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px w-6 sm:w-12 ${
                    i < currentIndex ? "bg-purple-600" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-violet-500"
            initial={false}
            animate={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main content + guidance panel */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-[#0d0820] border border-white/5 rounded-2xl p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === "petitioner" && (
                <PetitionerStep
                  data={intake.petitioner}
                  onChange={(petitioner) => updateIntake({ petitioner })}
                  onNext={goNext}
                />
              )}
              {currentStep === "beneficiary" && (
                <BeneficiaryStep
                  data={intake.beneficiary}
                  onChange={(beneficiary) => updateIntake({ beneficiary })}
                  onNext={goNext}
                  onBack={goPrev}
                />
              )}
              {currentStep === "marriage" && (
                <MarriageStep
                  data={intake.marriage}
                  onChange={(marriage) => updateIntake({ marriage })}
                  onNext={goNext}
                  onBack={goPrev}
                />
              )}
              {currentStep === "background" && (
                <BackgroundStep
                  data={intake.background}
                  onChange={(background) => updateIntake({ background })}
                  onNext={goNext}
                  onBack={goPrev}
                />
              )}
              {currentStep === "financial" && (
                <FinancialStep
                  data={intake.financial}
                  onChange={(financial) => updateIntake({ financial })}
                  onNext={goNext}
                  onBack={goPrev}
                />
              )}
              {currentStep === "review" && (
                <ReviewStep
                  intake={intake}
                  onBack={goPrev}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  error={error}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <GuidancePanel step={currentStep} intake={intake} />
      </div>
    </div>
  );
}
