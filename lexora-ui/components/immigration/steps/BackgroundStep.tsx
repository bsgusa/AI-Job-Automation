"use client";

import type { BackgroundInfo } from "@/types/immigration";
import {
  FormField,
  TextInput,
  Toggle,
  SectionTitle,
  StepNav,
} from "./shared";

interface Props {
  data: BackgroundInfo;
  onChange: (data: BackgroundInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BackgroundStep({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof BackgroundInfo>(k: K, v: BackgroundInfo[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionTitle>Background Information</SectionTitle>
      <p className="text-sm text-gray-400 mb-6 -mt-3">
        Answer honestly — USCIS checks criminal and immigration records. Failing
        to disclose is a ground for denial.
      </p>

      <div className="space-y-6">
        {/* Criminal history */}
        <div>
          <p className="text-sm font-semibold text-gray-300 mb-3">
            Criminal History
          </p>
          <div className="space-y-3">
            <Toggle
              label="Have you (petitioner) ever been arrested, cited, or convicted of any crime?"
              checked={data.everArrestedPetitioner}
              onChange={(v) => set("everArrestedPetitioner", v)}
              hint="Include DUI, misdemeanors, expunged records, and juvenile records."
            />
            {data.everArrestedPetitioner && (
              <FormField label="Details (petitioner arrests/convictions)">
                <TextInput
                  value={data.arrestDetailsPetitioner ?? ""}
                  onChange={(v) => set("arrestDetailsPetitioner", v)}
                  placeholder="Charge, date, outcome, jurisdiction"
                />
              </FormField>
            )}

            <Toggle
              label="Has your spouse (beneficiary) ever been arrested, cited, or convicted of any crime?"
              checked={data.everArrestedBeneficiary}
              onChange={(v) => set("everArrestedBeneficiary", v)}
            />
            {data.everArrestedBeneficiary && (
              <FormField label="Details (beneficiary arrests/convictions)">
                <TextInput
                  value={data.arrestDetailsBeneficiary ?? ""}
                  onChange={(v) => set("arrestDetailsBeneficiary", v)}
                  placeholder="Charge, date, outcome, jurisdiction"
                />
              </FormField>
            )}
          </div>
        </div>

        {/* Immigration history */}
        <div>
          <p className="text-sm font-semibold text-gray-300 mb-3">
            Immigration History
          </p>
          <div className="space-y-3">
            <Toggle
              label="Has your spouse ever been deported or removed from the U.S.?"
              checked={data.everDeportedBeneficiary || data.everRemovedBeneficiary}
              onChange={(v) => {
                set("everDeportedBeneficiary", v);
                set("everRemovedBeneficiary", v);
              }}
            />
            {(data.everDeportedBeneficiary || data.everRemovedBeneficiary) && (
              <FormField label="Details (deportation/removal)">
                <TextInput
                  value={data.deportationDetails ?? ""}
                  onChange={(v) => set("deportationDetails", v)}
                  placeholder="When, why, country removed to"
                />
              </FormField>
            )}

            <Toggle
              label="Has your spouse ever been denied a U.S. visa?"
              checked={data.everDeniedVisaBeneficiary}
              onChange={(v) => set("everDeniedVisaBeneficiary", v)}
            />
            {data.everDeniedVisaBeneficiary && (
              <FormField label="Visa denial details">
                <TextInput
                  value={data.visaDenialDetails ?? ""}
                  onChange={(v) => set("visaDenialDetails", v)}
                  placeholder="Which visa, when, reason given"
                />
              </FormField>
            )}

            <Toggle
              label="Has your spouse ever overstayed a visa, worked without authorization, or otherwise violated immigration law?"
              checked={data.everViolatedImmigrationLaw}
              onChange={(v) => set("everViolatedImmigrationLaw", v)}
            />
            {data.everViolatedImmigrationLaw && (
              <FormField label="Immigration violation details">
                <TextInput
                  value={data.immigrationViolationDetails ?? ""}
                  onChange={(v) => set("immigrationViolationDetails", v)}
                  placeholder="Describe"
                />
              </FormField>
            )}
          </div>
        </div>

        {/* Health / Military */}
        <div>
          <p className="text-sm font-semibold text-gray-300 mb-3">
            Health & Military
          </p>
          <div className="space-y-3">
            <Toggle
              label="Has your spouse completed a medical exam with a USCIS-designated civil surgeon?"
              checked={data.hasPhysicalExam}
              onChange={(v) => set("hasPhysicalExam", v)}
              hint="Form I-693 is required for I-485 — it does not need to be done before filing."
            />
            <Toggle
              label="Have you (petitioner) ever served in the U.S. military?"
              checked={data.everServedMilitaryPetitioner}
              onChange={(v) => set("everServedMilitaryPetitioner", v)}
            />
            {data.everServedMilitaryPetitioner && (
              <FormField label="Military service details">
                <TextInput
                  value={data.militaryDetails ?? ""}
                  onChange={(v) => set("militaryDetails", v)}
                  placeholder="Branch, dates, discharge type"
                />
              </FormField>
            )}
          </div>
        </div>
      </div>

      <StepNav onBack={onBack} onNext={onNext} />
    </div>
  );
}
