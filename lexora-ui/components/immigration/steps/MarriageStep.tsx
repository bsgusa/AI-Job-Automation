"use client";

import type { MarriageDetails } from "@/types/immigration";
import {
  FormField,
  TextInput,
  SelectInput,
  Toggle,
  SectionTitle,
  Grid,
  StepNav,
} from "./shared";

interface Props {
  data: MarriageDetails;
  onChange: (data: MarriageDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MarriageStep({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof MarriageDetails>(k: K, v: MarriageDetails[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionTitle>Marriage Details</SectionTitle>

      <div className="space-y-5">
        <FormField label="Date of Marriage" required>
          <TextInput
            type="date"
            value={data.marriageDate}
            onChange={(v) => set("marriageDate", v)}
          />
        </FormField>

        <Grid>
          <FormField label="City / Town of Marriage" required>
            <TextInput
              value={data.marriageCity}
              onChange={(v) => set("marriageCity", v)}
              placeholder="Las Vegas"
            />
          </FormField>
          <FormField label="State (if U.S.)">
            <TextInput
              value={data.marriageState ?? ""}
              onChange={(v) => set("marriageState", v)}
              placeholder="Nevada"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Country of Marriage" required>
            <TextInput
              value={data.marriageCountry}
              onChange={(v) => set("marriageCountry", v)}
              placeholder="United States"
            />
          </FormField>
          <FormField label="Type of Ceremony" required>
            <SelectInput
              value={data.ceremonyType}
              onChange={(v) =>
                set("ceremonyType", v as MarriageDetails["ceremonyType"])
              }
              options={[
                { value: "civil", label: "Civil (courthouse / judge)" },
                { value: "religious", label: "Religious" },
                { value: "other", label: "Other" },
              ]}
            />
          </FormField>
        </Grid>

        <FormField label="Officiant Name">
          <TextInput
            value={data.officiantName ?? ""}
            onChange={(v) => set("officiantName", v)}
            placeholder="Judge Johnson or Pastor Smith"
          />
        </FormField>

        {/* Bona fide evidence */}
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-300 mb-1">
            Bona Fide Marriage Evidence
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Check all that apply. USCIS looks for at least 2 categories of
            evidence to establish a genuine marriage.
          </p>

          <div className="space-y-3">
            <Toggle
              label="Joint bank account"
              checked={data.jointBankAccount}
              onChange={(v) => set("jointBankAccount", v)}
              hint="Both names on checking or savings account"
            />
            <Toggle
              label="Joint lease or mortgage"
              checked={data.jointLease}
              onChange={(v) => set("jointLease", v)}
              hint="Both names on a lease or property deed"
            />
            <Toggle
              label="Living together (cohabitation)"
              checked={data.cohabitation}
              onChange={(v) => set("cohabitation", v)}
              hint="Currently or recently sharing a residence"
            />
            <Toggle
              label="Shared financial accounts or assets"
              checked={data.jointAssets}
              onChange={(v) => set("jointAssets", v)}
              hint="Joint insurance, investment, or retirement accounts"
            />
            <Toggle
              label="Shared daily expenses"
              checked={data.sharedExpenses}
              onChange={(v) => set("sharedExpenses", v)}
              hint="Joint utility bills, subscriptions, etc."
            />
            <Toggle
              label="Children born of this marriage"
              checked={data.hasChildren}
              onChange={(v) => set("hasChildren", v)}
            />
          </div>
        </div>

        <FormField
          label="Additional Evidence (optional)"
          hint="Describe other evidence: photos, travel together, affidavits from family, etc."
        >
          <textarea
            value={data.additionalEvidence ?? ""}
            onChange={(e) => set("additionalEvidence", e.target.value)}
            placeholder="e.g. We have 200+ photos spanning 3 years, affidavits from 4 family members, and shared car insurance."
            rows={3}
            className="w-full bg-[#07040f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
          />
        </FormField>
      </div>

      <StepNav onBack={onBack} onNext={onNext} />
    </div>
  );
}
