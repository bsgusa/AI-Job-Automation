"use client";

import type { BeneficiaryInfo } from "@/types/immigration";
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
  data: BeneficiaryInfo;
  onChange: (data: BeneficiaryInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

function set<K extends keyof BeneficiaryInfo>(
  data: BeneficiaryInfo,
  key: K,
  value: BeneficiaryInfo[K]
): BeneficiaryInfo {
  return { ...data, [key]: value };
}

export default function BeneficiaryStep({ data, onChange, onNext, onBack }: Props) {
  const upd = <K extends keyof BeneficiaryInfo>(k: K, v: BeneficiaryInfo[K]) =>
    onChange(set(data, k, v));

  return (
    <div>
      <SectionTitle>About Your Spouse (Beneficiary)</SectionTitle>

      <div className="space-y-5">
        <Grid>
          <FormField label="Last Name" required>
            <TextInput
              value={data.familyName}
              onChange={(v) => upd("familyName", v)}
              placeholder="Garcia"
            />
          </FormField>
          <FormField label="First Name" required>
            <TextInput
              value={data.givenName}
              onChange={(v) => upd("givenName", v)}
              placeholder="Maria"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Middle Name">
            <TextInput
              value={data.middleName ?? ""}
              onChange={(v) => upd("middleName", v)}
              placeholder="(optional)"
            />
          </FormField>
          <FormField label="Other Names">
            <TextInput
              value={data.otherNames ?? ""}
              onChange={(v) => upd("otherNames", v)}
              placeholder="Maiden name, aliases"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Date of Birth" required>
            <TextInput
              type="date"
              value={data.dateOfBirth}
              onChange={(v) => upd("dateOfBirth", v)}
            />
          </FormField>
          <FormField label="City/Town of Birth" required>
            <TextInput
              value={data.placeOfBirth}
              onChange={(v) => upd("placeOfBirth", v)}
              placeholder="Mexico City"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Country of Birth" required>
            <TextInput
              value={data.countryOfBirth}
              onChange={(v) => upd("countryOfBirth", v)}
              placeholder="Mexico"
            />
          </FormField>
          <FormField label="Country of Citizenship" required>
            <TextInput
              value={data.countryOfCitizenship}
              onChange={(v) => upd("countryOfCitizenship", v)}
              placeholder="Mexico"
            />
          </FormField>
        </Grid>

        {/* Immigration documents */}
        <p className="text-sm font-medium text-gray-400 pt-2">
          Immigration Information
        </p>

        <Grid>
          <FormField
            label="Current Immigration Status"
            hint="e.g. F-1, H-4, B-2, Overstay, Undocumented"
          >
            <TextInput
              value={data.currentImmigrationStatus ?? ""}
              onChange={(v) => upd("currentImmigrationStatus", v)}
              placeholder="e.g. F-1 student"
            />
          </FormField>
          <FormField label="Visa Class on Last Entry">
            <TextInput
              value={data.visaClass ?? ""}
              onChange={(v) => upd("visaClass", v)}
              placeholder="e.g. B-2"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField
            label="Date of Last U.S. Entry"
            hint="Leave blank if born in the US."
          >
            <TextInput
              type="date"
              value={data.dateOfLastEntry ?? ""}
              onChange={(v) => upd("dateOfLastEntry", v)}
            />
          </FormField>
          <FormField
            label="I-94 Number"
            hint="Find at cbp.gov/i94"
          >
            <TextInput
              value={data.i94Number ?? ""}
              onChange={(v) => upd("i94Number", v)}
              placeholder="11 digits"
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Passport Number">
            <TextInput
              value={data.passportNumber ?? ""}
              onChange={(v) => upd("passportNumber", v)}
            />
          </FormField>
          <FormField label="Passport Expiration Date">
            <TextInput
              type="date"
              value={data.passportExpiry ?? ""}
              onChange={(v) => upd("passportExpiry", v)}
            />
          </FormField>
        </Grid>

        <FormField label="Alien Registration Number (A-Number)">
          <TextInput
            value={data.alienRegNumber ?? ""}
            onChange={(v) => upd("alienRegNumber", v)}
            placeholder="A-XXXXXXXXX (if applicable)"
          />
        </FormField>

        {/* Contact */}
        <p className="text-sm font-medium text-gray-400 pt-2">Contact</p>

        <FormField label="Street Address" required>
          <TextInput
            value={data.currentAddress.street}
            onChange={(v) =>
              upd("currentAddress", { ...data.currentAddress, street: v })
            }
            placeholder="123 Main St"
          />
        </FormField>

        <Grid>
          <FormField label="City" required>
            <TextInput
              value={data.currentAddress.city}
              onChange={(v) =>
                upd("currentAddress", { ...data.currentAddress, city: v })
              }
            />
          </FormField>
          <FormField label="State">
            <TextInput
              value={data.currentAddress.state ?? ""}
              onChange={(v) =>
                upd("currentAddress", { ...data.currentAddress, state: v })
              }
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="ZIP Code">
            <TextInput
              value={data.currentAddress.zipCode ?? ""}
              onChange={(v) =>
                upd("currentAddress", { ...data.currentAddress, zipCode: v })
              }
            />
          </FormField>
          <FormField label="Country" required>
            <TextInput
              value={data.currentAddress.country}
              onChange={(v) =>
                upd("currentAddress", { ...data.currentAddress, country: v })
              }
            />
          </FormField>
        </Grid>

        <Grid>
          <FormField label="Phone" required>
            <TextInput
              type="tel"
              value={data.phone}
              onChange={(v) => upd("phone", v)}
            />
          </FormField>
          <FormField label="Email" required>
            <TextInput
              type="email"
              value={data.email}
              onChange={(v) => upd("email", v)}
            />
          </FormField>
        </Grid>

        <FormField label="Number of Prior Marriages">
          <SelectInput
            value={String(data.priorMarriagesCount)}
            onChange={(v) => upd("priorMarriagesCount", Number(v))}
            options={[
              { value: "0", label: "0 — Never previously married" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3+" },
            ]}
          />
        </FormField>

        <FormField label="Number of Children">
          <SelectInput
            value={String(data.childrenCount)}
            onChange={(v) => upd("childrenCount", Number(v))}
            options={[
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4+" },
            ]}
          />
        </FormField>

        <Toggle
          label="Beneficiary has a U.S. Social Security Number"
          checked={data.hasSSN}
          onChange={(v) => upd("hasSSN", v)}
        />

        {data.hasSSN && (
          <FormField label="Social Security Number">
            <TextInput
              value={data.ssn ?? ""}
              onChange={(v) => upd("ssn", v)}
              placeholder="XXX-XX-XXXX"
            />
          </FormField>
        )}
      </div>

      <StepNav onBack={onBack} onNext={onNext} />
    </div>
  );
}
