import { PDFDocument, PDFForm } from "pdf-lib";
import type { IntakeData } from "@/types/immigration";

// Official USCIS fillable PDF URLs (Edition dates are current as of 2024).
// These forms are public domain — no redistribution restrictions.
const USCIS_FORM_URLS: Record<string, string> = {
  "I-130":
    "https://www.uscis.gov/sites/default/files/document/forms/i-130.pdf",
  "I-485":
    "https://www.uscis.gov/sites/default/files/document/forms/i-485.pdf",
  "I-864":
    "https://www.uscis.gov/sites/default/files/document/forms/i-864.pdf",
  "I-765":
    "https://www.uscis.gov/sites/default/files/document/forms/i-765.pdf",
  "I-131":
    "https://www.uscis.gov/sites/default/files/document/forms/i-131.pdf",
};

export interface GeneratedPacket {
  forms: { name: string; bytes: Uint8Array }[];
  errors: string[];
}

export async function generatePacket(
  intake: IntakeData
): Promise<GeneratedPacket> {
  const forms: { name: string; bytes: Uint8Array }[] = [];
  const errors: string[] = [];

  const [i130Result, i485Result, i864Result] = await Promise.allSettled([
    fillI130(intake),
    fillI485(intake),
    fillI864(intake),
  ]);

  if (i130Result.status === "fulfilled") {
    forms.push({ name: "I-130_Petition_for_Alien_Relative.pdf", bytes: i130Result.value });
  } else {
    errors.push(`I-130: ${i130Result.reason}`);
  }

  if (i485Result.status === "fulfilled") {
    forms.push({ name: "I-485_Application_to_Register_Permanent_Residence.pdf", bytes: i485Result.value });
  } else {
    errors.push(`I-485: ${i485Result.reason}`);
  }

  if (i864Result.status === "fulfilled") {
    forms.push({ name: "I-864_Affidavit_of_Support.pdf", bytes: i864Result.value });
  } else {
    errors.push(`I-864: ${i864Result.reason}`);
  }

  return { forms, errors };
}

async function fetchAndLoad(formKey: string): Promise<PDFDocument> {
  const url = USCIS_FORM_URLS[formKey];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${formKey}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return PDFDocument.load(arrayBuffer);
}

function safeSet(form: PDFForm, fieldName: string, value: string | boolean | undefined) {
  if (value === undefined || value === null || value === "") return;
  try {
    if (typeof value === "boolean") {
      const field = form.getCheckBox(fieldName);
      if (value) field.check();
      else field.uncheck();
    } else {
      const field = form.getTextField(fieldName);
      field.setText(value);
    }
  } catch {
    // Field name may differ in newer form editions — skip silently
  }
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

async function fillI130(intake: IntakeData): Promise<Uint8Array> {
  const doc = await fetchAndLoad("I-130");
  const form = doc.getForm();
  const { petitioner: p, beneficiary: b, marriage: m } = intake;

  // Part 1 — Information About You (Petitioner)
  safeSet(form, "Pt1Line1a_FamilyName", p.familyName);
  safeSet(form, "Pt1Line1b_GivenName", p.givenName);
  safeSet(form, "Pt1Line1c_MiddleName", p.middleName);
  safeSet(form, "Pt1Line2_OtherNames", p.otherNames);
  safeSet(form, "Pt1Line3_DateofBirth", formatDate(p.dateOfBirth));
  safeSet(form, "Pt1Line4_CityTownofBirth", p.placeOfBirth);
  safeSet(form, "Pt1Line5_CountryofBirth", p.countryOfBirth);
  safeSet(form, "Pt1Line6_CountryofCitizenship", p.countryOfCitizenship);

  safeSet(form, "Pt1Line7_AlienNumber", p.alienRegNumber);
  safeSet(form, "Pt1Line8_SSN", p.ssn);
  safeSet(form, "Pt1Line9_USCISOnlineAccountNumber", "");

  // Address
  safeSet(form, "Pt1Line10a_StreetNumberName", p.address.street);
  safeSet(form, "Pt1Line10b_Unit", p.address.apt);
  safeSet(form, "Pt1Line10c_CityOrTown", p.address.city);
  safeSet(form, "Pt1Line10d_State", p.address.state);
  safeSet(form, "Pt1Line10e_ZipCode", p.address.zipCode);
  safeSet(form, "Pt1Line10f_Province", "");
  safeSet(form, "Pt1Line10g_PostalCode", "");
  safeSet(form, "Pt1Line10h_Country", p.address.country);

  safeSet(form, "Pt1Line11_DaytimeTelephoneNum", p.phone);
  safeSet(form, "Pt1Line12_EmailAddress", p.email);

  // Part 2 — Relationship
  // Spouse checkbox — field name varies by edition
  safeSet(form, "Pt2Line1_RelationshipType[1]", true); // spouse (IR-1)

  // Part 3 — Information About Beneficiary
  safeSet(form, "Pt3Line1a_FamilyName", b.familyName);
  safeSet(form, "Pt3Line1b_GivenName", b.givenName);
  safeSet(form, "Pt3Line1c_MiddleName", b.middleName);
  safeSet(form, "Pt3Line2_OtherNames", b.otherNames);
  safeSet(form, "Pt3Line3_DateofBirth", formatDate(b.dateOfBirth));
  safeSet(form, "Pt3Line4_CityTownofBirth", b.placeOfBirth);
  safeSet(form, "Pt3Line5_CountryofBirth", b.countryOfBirth);
  safeSet(form, "Pt3Line6_CountryofCitizenship", b.countryOfCitizenship);
  safeSet(form, "Pt3Line7_AlienNumber", b.alienRegNumber);
  safeSet(form, "Pt3Line8_PassportNumber", b.passportNumber);

  // Current address
  safeSet(form, "Pt3Line9a_StreetNumberName", b.currentAddress.street);
  safeSet(form, "Pt3Line9b_Unit", b.currentAddress.apt);
  safeSet(form, "Pt3Line9c_CityOrTown", b.currentAddress.city);
  safeSet(form, "Pt3Line9d_State", b.currentAddress.state);
  safeSet(form, "Pt3Line9e_ZipCode", b.currentAddress.zipCode);
  safeSet(form, "Pt3Line9h_Country", b.currentAddress.country);

  // Marriage info
  safeSet(form, "Pt3Line12_DateofMarriage", formatDate(m.marriageDate));
  safeSet(form, "Pt3Line13_PlaceofMarriage", `${m.marriageCity}, ${m.marriageCountry}`);
  safeSet(form, "Pt3Line14a_FamilyName_PriorSpouse", p.priorMarriages?.[0]?.spouseName ?? "");

  doc.getForm().flatten(); // flatten makes fields read-only in the output
  return doc.save();
}

async function fillI485(intake: IntakeData): Promise<Uint8Array> {
  const doc = await fetchAndLoad("I-485");
  const form = doc.getForm();
  const { beneficiary: b, petitioner: p, marriage: m, background: bg } = intake;

  // Part 1 — Information About You (Beneficiary)
  safeSet(form, "Pt1Line1a_FamilyName", b.familyName);
  safeSet(form, "Pt1Line1b_GivenName", b.givenName);
  safeSet(form, "Pt1Line1c_MiddleName", b.middleName);
  safeSet(form, "Pt1Line3_DateofBirth", formatDate(b.dateOfBirth));
  safeSet(form, "Pt1Line4_CityofBirth", b.placeOfBirth);
  safeSet(form, "Pt1Line5_CountryofBirth", b.countryOfBirth);
  safeSet(form, "Pt1Line6_CountryofCitizenship", b.countryOfCitizenship);
  safeSet(form, "Pt1Line7_AlienNumber", b.alienRegNumber);
  safeSet(form, "Pt1Line8_USCIS_AccountNumber", "");
  safeSet(form, "Pt1Line9_I94Number", b.i94Number);
  safeSet(form, "Pt1Line10_PassportNumber", b.passportNumber);
  safeSet(form, "Pt1Line11_PassportExpDate", formatDate(b.passportExpiry));
  safeSet(form, "Pt1Line12_SSN", b.ssn);

  // Current address
  safeSet(form, "Pt1Line13a_StreetNumberName", b.currentAddress.street);
  safeSet(form, "Pt1Line13b_Unit", b.currentAddress.apt);
  safeSet(form, "Pt1Line13c_CityOrTown", b.currentAddress.city);
  safeSet(form, "Pt1Line13d_State", b.currentAddress.state);
  safeSet(form, "Pt1Line13e_ZipCode", b.currentAddress.zipCode);

  // Part 2 — Basis for eligibility: spouse of USC
  safeSet(form, "Pt2Line1_ImmigrantCategory[1]", true);

  // Part 3 — Processing information
  safeSet(form, "Pt3Line1_DateofLastArrival", formatDate(b.dateOfLastEntry));
  safeSet(form, "Pt3Line2_I94Number", b.i94Number);
  safeSet(form, "Pt3Line3_StatusOnArrival", b.visaClass);
  safeSet(form, "Pt3Line4_StatusExpDate", "");

  // Part 8 — Background information (yes/no questions about criminal/immigration history)
  safeSet(form, "Pt8Line1_YesNo[1]", bg.everDeportedBeneficiary);
  safeSet(form, "Pt8Line2_YesNo[1]", bg.everRemovedBeneficiary);
  safeSet(form, "Pt8Line3_YesNo[0]", !bg.everDeniedVisaBeneficiary);

  doc.getForm().flatten();
  return doc.save();
}

async function fillI864(intake: IntakeData): Promise<Uint8Array> {
  const doc = await fetchAndLoad("I-864");
  const form = doc.getForm();
  const { petitioner: p, financial: f, beneficiary: b } = intake;

  // Part 1 — Basis for Filing
  safeSet(form, "Pt1Line1_SponsorType[0]", true); // petitioning sponsor

  // Part 2 — Sponsor Information
  safeSet(form, "Pt2Line1a_FamilyName", p.familyName);
  safeSet(form, "Pt2Line1b_GivenName", p.givenName);
  safeSet(form, "Pt2Line1c_MiddleName", p.middleName);
  safeSet(form, "Pt2Line2_MailingAddress_StreetNumberName", p.address.street);
  safeSet(form, "Pt2Line2_MailingAddress_Unit", p.address.apt);
  safeSet(form, "Pt2Line2_MailingAddress_CityOrTown", p.address.city);
  safeSet(form, "Pt2Line2_MailingAddress_State", p.address.state);
  safeSet(form, "Pt2Line2_MailingAddress_ZipCode", p.address.zipCode);
  safeSet(form, "Pt2Line3_DaytimePhone", p.phone);
  safeSet(form, "Pt2Line4_EmailAddress", p.email);
  safeSet(form, "Pt2Line5_USCitizen_YesNo[0]", true); // USC

  safeSet(form, "Pt2Line8_DateofBirth", formatDate(p.dateOfBirth));
  safeSet(form, "Pt2Line9_SSN", p.ssn);

  // Part 5 — Household size and income
  safeSet(form, "Pt5Line1_HouseholdSize", String(f.petitionerHouseholdSize));
  safeSet(form, "Pt5Line13a_CurrentAnnualIncome", String(f.petitionerAnnualIncome ?? ""));

  // Part 6 — Sponsor's employment
  const employed = f.petitionerEmploymentStatus === "employed" || f.petitionerEmploymentStatus === "self_employed";
  safeSet(form, "Pt6Line1_EmploymentStatus[0]", employed);
  safeSet(form, "Pt6Line2_NameofEmployer", f.petitionerEmployerName);
  safeSet(form, "Pt6Line3_Occupation", f.petitionerOccupation);

  // Part 3 — Immigrant information
  safeSet(form, "Pt3Line1a_FamilyName", b.familyName);
  safeSet(form, "Pt3Line1b_GivenName", b.givenName);
  safeSet(form, "Pt3Line2_RelationshipToSponsor", "Spouse");
  safeSet(form, "Pt3Line3_DateofBirth", formatDate(b.dateOfBirth));
  safeSet(form, "Pt3Line4_CountryofBirth", b.countryOfBirth);
  safeSet(form, "Pt3Line5_AlienNumber", b.alienRegNumber);

  doc.getForm().flatten();
  return doc.save();
}
