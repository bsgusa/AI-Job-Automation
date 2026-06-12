"use client";

import type { FinancialInfo } from "@/types/immigration";
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
  data: FinancialInfo;
  onChange: (data: FinancialInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

// 2024 125% FPG thresholds (contiguous 48 states)
const FPG_THRESHOLDS: Record<number, number> = {
  2: 24650, 3: 31075, 4: 37500, 5: 43925, 6: 50350, 7: 56775, 8: 63200,
};

function getThreshold(householdSize: number): number {
  if (householdSize <= 1) return 18075;
  if (householdSize >= 8) return FPG_THRESHOLDS[8] + (householdSize - 8) * 6425;
  return FPG_THRESHOLDS[householdSize] ?? 24650;
}

export default function FinancialStep({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof FinancialInfo>(k: K, v: FinancialInfo[K]) =>
    onChange({ ...data, [k]: v });

  const threshold = getThreshold(data.petitionerHouseholdSize);
  const income = data.petitionerAnnualIncome ?? 0;
  const meetsRequirement = income >= threshold;

  return (
    <div>
      <SectionTitle>Financial & Affidavit of Support (I-864)</SectionTitle>

      <div className="space-y-5">
        <FormField
          label="Employment Status"
          required
        >
          <SelectInput
            value={data.petitionerEmploymentStatus}
            onChange={(v) =>
              set(
                "petitionerEmploymentStatus",
                v as FinancialInfo["petitionerEmploymentStatus"]
              )
            }
            options={[
              { value: "employed", label: "Employed (full or part-time)" },
              { value: "self_employed", label: "Self-employed" },
              { value: "retired", label: "Retired" },
              { value: "student", label: "Student" },
              { value: "unemployed", label: "Unemployed" },
            ]}
          />
        </FormField>

        {(data.petitionerEmploymentStatus === "employed" ||
          data.petitionerEmploymentStatus === "self_employed") && (
          <Grid>
            <FormField label="Employer Name">
              <TextInput
                value={data.petitionerEmployerName ?? ""}
                onChange={(v) => set("petitionerEmployerName", v)}
                placeholder="Acme Corp"
              />
            </FormField>
            <FormField label="Occupation / Job Title">
              <TextInput
                value={data.petitionerOccupation ?? ""}
                onChange={(v) => set("petitionerOccupation", v)}
                placeholder="Software Engineer"
              />
            </FormField>
          </Grid>
        )}

        <Grid>
          <FormField
            label="Annual Income ($)"
            hint="From your most recent federal tax return"
            required
          >
            <TextInput
              type="number"
              value={String(data.petitionerAnnualIncome ?? "")}
              onChange={(v) => set("petitionerAnnualIncome", Number(v))}
              placeholder="55000"
            />
          </FormField>
          <FormField
            label="Household Size"
            hint="You + dependents + beneficiary + beneficiary's children being included"
            required
          >
            <SelectInput
              value={String(data.petitionerHouseholdSize)}
              onChange={(v) => set("petitionerHouseholdSize", Number(v))}
              options={Array.from({ length: 10 }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
              }))}
            />
          </FormField>
        </Grid>

        {/* Income requirement indicator */}
        {income > 0 && (
          <div
            className={`rounded-xl p-4 border ${
              meetsRequirement
                ? "bg-green-500/10 border-green-500/20"
                : "bg-amber-500/10 border-amber-500/20"
            }`}
          >
            <p className={`text-sm font-medium ${meetsRequirement ? "text-green-300" : "text-amber-300"}`}>
              {meetsRequirement ? "✓ Income meets requirement" : "⚠ Income below requirement"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Required for household of {data.petitionerHouseholdSize}:{" "}
              <strong>${threshold.toLocaleString()}</strong> / year (125% FPG).
              {!meetsRequirement &&
                " Consider a joint sponsor or documenting assets."}
            </p>
          </div>
        )}

        <Toggle
          label="I will use a Joint Sponsor"
          checked={data.hasJointSponsor}
          onChange={(v) => set("hasJointSponsor", v)}
          hint="Required if your income is below 125% of Federal Poverty Guidelines"
        />

        {data.hasJointSponsor && (
          <Grid>
            <FormField label="Joint Sponsor Full Name">
              <TextInput
                value={data.jointSponsorName ?? ""}
                onChange={(v) => set("jointSponsorName", v)}
                placeholder="Jane Doe"
              />
            </FormField>
            <FormField label="Relationship to Petitioner">
              <TextInput
                value={data.jointSponsorRelationship ?? ""}
                onChange={(v) => set("jointSponsorRelationship", v)}
                placeholder="Parent, sibling, friend, etc."
              />
            </FormField>
          </Grid>
        )}

        {/* Assets section */}
        <div>
          <p className="text-xs text-gray-500 mb-3">
            Optional: List assets if income alone is insufficient (USCIS accepts
            assets worth 5× the income shortfall).
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Real Property Value ($)">
              <TextInput
                type="number"
                value={String(data.realPropertyValue ?? "")}
                onChange={(v) => set("realPropertyValue", Number(v))}
                placeholder="200000"
              />
            </FormField>
            <FormField label="Savings / Bank Accounts ($)">
              <TextInput
                type="number"
                value={String(data.savingsValue ?? "")}
                onChange={(v) => set("savingsValue", Number(v))}
                placeholder="10000"
              />
            </FormField>
            <FormField label="Stocks / Investments ($)">
              <TextInput
                type="number"
                value={String(data.stocksValue ?? "")}
                onChange={(v) => set("stocksValue", Number(v))}
                placeholder="5000"
              />
            </FormField>
          </div>
        </div>
      </div>

      <StepNav onBack={onBack} onNext={onNext} />
    </div>
  );
}
