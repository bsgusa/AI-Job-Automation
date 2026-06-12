"use client";

import type { PetitionerInfo } from "@/types/immigration";
import {
  FormField,
  TextInput,
  SelectInput,
  SectionTitle,
  Grid,
  StepNav,
} from "./shared";

interface Props {
  data: PetitionerInfo;
  onChange: (data: PetitionerInfo) => void;
  onNext: () => void;
}

const CITIZENSHIP_OPTIONS = [
  { value: "birth", label: "Birth in the U.S." },
  { value: "naturalization", label: "Naturalization" },
  { value: "parents", label: "Through parents" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
].map((s) => ({ value: s, label: s }));

function upd<K extends keyof PetitionerInfo>(
  data: PetitionerInfo,
  key: K,
  value: PetitionerInfo[K]
): PetitionerInfo {
  return { ...data, [key]: value };
}

export default function PetitionerStep({ data, onChange, onNext }: Props) {
  const set = <K extends keyof PetitionerInfo>(k: K, v: PetitionerInfo[K]) =>
    onChange(upd(data, k, v));

  return (
    <div>
      <SectionTitle>About You (U.S. Citizen Petitioner)</SectionTitle>

      <div className="space-y-5">
        <Grid>
          <FormField label="Last Name (Family Name)" required>
            <TextInput
              value={data.familyName}
              onChange={(v) => set("familyName", v)}
              placeholder="Smith"
            />
          </FormField>
          <FormField label="First Name (Given Name)" required>
            <TextInput
              value={data.givenName}
              onChange={(v) => set("givenName", v)}
              placeholder="John"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Middle Name">
            <TextInput
              value={data.middleName ?? ""}
              onChange={(v) => set("middleName", v)}
              placeholder="(optional)"
            />
          </FormField>
          <FormField label="Other Names (maiden, aliases)">
            <TextInput
              value={data.otherNames ?? ""}
              onChange={(v) => set("otherNames", v)}
              placeholder="(if any)"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Date of Birth" required>
            <TextInput
              type="date"
              value={data.dateOfBirth}
              onChange={(v) => set("dateOfBirth", v)}
            />
          </FormField>
          <FormField label="City/Town of Birth" required>
            <TextInput
              value={data.placeOfBirth}
              onChange={(v) => set("placeOfBirth", v)}
              placeholder="Chicago"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Country of Birth" required>
            <TextInput
              value={data.countryOfBirth}
              onChange={(v) => set("countryOfBirth", v)}
              placeholder="United States"
            />
          </FormField>
          <FormField label="You Became a U.S. Citizen By" required>
            <SelectInput
              value={data.usCitizenshipHow}
              onChange={(v) =>
                set("usCitizenshipHow", v as PetitionerInfo["usCitizenshipHow"])
              }
              options={CITIZENSHIP_OPTIONS}
            />
          </FormField>
        </Grid>

        {data.usCitizenshipHow === "naturalization" && (
          <Grid>
            <FormField label="Naturalization Certificate Number" required>
              <TextInput
                value={data.naturalizationNumber ?? ""}
                onChange={(v) => set("naturalizationNumber", v)}
                placeholder="e.g. 12345678"
              />
            </FormField>
            <FormField label="Date of Naturalization" required>
              <TextInput
                type="date"
                value={data.naturalizationDate ?? ""}
                onChange={(v) => set("naturalizationDate", v)}
              />
            </FormField>
          </Grid>
        )}

        <FormField
          label="Social Security Number"
          hint="Required on Form I-130. Leave blank if you don't have one (rare for USC)."
        >
          <TextInput
            value={data.ssn ?? ""}
            onChange={(v) => set("ssn", v)}
            placeholder="XXX-XX-XXXX"
          />
        </FormField>

        {/* Current address */}
        <p className="text-sm font-medium text-gray-400 pt-2">Current Address</p>

        <FormField label="Street Address" required>
          <TextInput
            value={data.address.street}
            onChange={(v) => set("address", { ...data.address, street: v })}
            placeholder="123 Main St"
          />
        </FormField>

        <Grid>
          <FormField label="Apt / Unit">
            <TextInput
              value={data.address.apt ?? ""}
              onChange={(v) => set("address", { ...data.address, apt: v })}
              placeholder="Apt 4B"
            />
          </FormField>
          <FormField label="City" required>
            <TextInput
              value={data.address.city}
              onChange={(v) => set("address", { ...data.address, city: v })}
              placeholder="Los Angeles"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="State" required>
            <SelectInput
              value={data.address.state ?? ""}
              onChange={(v) => set("address", { ...data.address, state: v })}
              options={[{ value: "", label: "Select state…" }, ...US_STATES]}
            />
          </FormField>
          <FormField label="ZIP Code" required>
            <TextInput
              value={data.address.zipCode ?? ""}
              onChange={(v) => set("address", { ...data.address, zipCode: v })}
              placeholder="90210"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Phone" required>
            <TextInput
              type="tel"
              value={data.phone}
              onChange={(v) => set("phone", v)}
              placeholder="(555) 555-5555"
            />
          </FormField>
          <FormField label="Email" required>
            <TextInput
              type="email"
              value={data.email}
              onChange={(v) => set("email", v)}
              placeholder="you@email.com"
            />
          </FormField>
        </Grid>

        <FormField
          label="Number of Prior Marriages"
          hint="Include all previous marriages, regardless of how they ended."
        >
          <SelectInput
            value={String(data.priorMarriagesCount)}
            onChange={(v) => set("priorMarriagesCount", Number(v))}
            options={[
              { value: "0", label: "0 — Never previously married" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3+" },
            ]}
          />
        </FormField>
      </div>

      <StepNav onNext={onNext} isFirstStep />
    </div>
  );
}
