import Anthropic from "@anthropic-ai/sdk";
import type { IntakeData, ChecklistItem, RFERisk } from "@/types/immigration";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Curated USCIS guidance — cached across requests via prompt caching.
// Each section is a dense summary of official USCIS instructions.
const USCIS_SYSTEM_PROMPT = `You are Lexora AI, an expert immigration guidance assistant specializing in marriage-based green cards (Form I-130 + Form I-485). You provide accurate, helpful guidance based on official USCIS instructions and policy.

IMPORTANT DISCLAIMERS:
- You provide general legal information, not legal advice
- Users should consult a qualified immigration attorney for complex situations
- USCIS forms and fees change — always verify with uscis.gov

=== I-130 (PETITION FOR ALIEN RELATIVE) ===

ELIGIBILITY: A U.S. citizen (USC) filing for a spouse (IR-1 category) does not face visa number backlogs — spouses of USCs are "immediate relatives" and can concurrently file I-485.

PETITIONER REQUIREMENTS:
- Must be USC (birth, naturalization, or through parents) OR lawful permanent resident (LPR) for I-130 alone
- Must prove bona fide marriage — genuine, not for immigration purposes
- Prior marriages must be legally terminated before current marriage
- If petitioner was previously divorced, provide divorce decree(s)

BONA FIDE MARRIAGE EVIDENCE (provide 2-4 categories):
1. Joint financial documents: bank statements, tax returns, insurance
2. Cohabitation proof: lease, mortgage, utility bills showing both names
3. Social evidence: photos together over time, affidavits from friends/family
4. Children born to the marriage: birth certificates
5. Communications: if separated by distance, phone/email records

FORM I-130 PACKET:
- Form I-130 (signed by petitioner)
- Form I-130A (if beneficiary is not in the US)
- USCIS Form I-130 filing fee (check uscis.gov for current amount)
- Petitioner's proof of USC status (passport, birth cert, or naturalization cert)
- Marriage certificate (official, with government seal)
- If prior marriages: divorce decree(s) or death certificate(s) for ALL prior spouses
- Two passport-style photos of beneficiary
- Copy of beneficiary's birth certificate

=== I-485 (ADJUSTMENT OF STATUS) ===

ELIGIBILITY: Beneficiary must be physically present in the US, have entered lawfully (valid visa or parole), and have an approved or concurrently filed I-130.

BARS TO ADJUSTMENT:
- Entered without inspection (EWI) — usually cannot adjust without I-601A waiver
- Prior deportation order — may require Motion to Reopen
- 3/10-year bars for unlawful presence (if departed after accruing unlawful presence)
- Certain criminal convictions — consult attorney

I-485 PACKET (concurrent filing with I-130 for USC petitioners):
- Form I-485
- Form I-864 (Affidavit of Support) — petitioner must meet 125% of Federal Poverty Guidelines for household size
- Form I-864A (if using household member's income)
- Form I-131 (Advance Parole) — optional, allows travel while pending; do NOT travel without this if I-485 pending
- Form I-765 (Employment Authorization) — optional but recommended; allows work while pending
- Form I-693 (Medical Exam) — completed by USCIS-designated civil surgeon, sealed envelope
- Two passport-style photos
- Copy of valid passport (all pages)
- Copy of visa/I-94 entry record (print from cbp.gov)
- Copy of prior immigration documents (EAD, visa approvals)
- Filing fees (I-485 + biometrics; check uscis.gov for current amounts)

=== FINANCIAL / I-864 AFFIDAVIT OF SUPPORT ===

The petitioner must demonstrate income at or above 125% of the Federal Poverty Guidelines (FPG) for their household size.

2024 125% FPG thresholds (contiguous US):
- 2 people: $24,650
- 3 people: $31,075
- 4 people: $37,500
- 5 people: $43,925
- Add ~$6,425 per additional person

HOUSEHOLD SIZE = sponsor + sponsor's dependents + beneficiary + beneficiary's dependents being included.

If income is insufficient, sponsor can use assets (5x the shortfall). Alternatively, a Joint Sponsor (Form I-864 with their own package) can be used.

REQUIRED I-864 DOCUMENTS:
- Most recent federal tax return (all pages) OR IRS transcript
- W-2s and/or 1099s for most recent year
- Recent pay stubs (3 months) if employed
- Employment verification letter
- If self-employed: Schedule C + business documents

=== COMMON RFE TRIGGERS ===

1. BONA FIDE MARRIAGE: Insufficient evidence of genuine marriage — especially if couple married quickly, lives separately, or has large age difference
2. INCOME BELOW FPG: Joint sponsor needed but not included; incorrect household size calculation
3. CIVIL SURGEON FORM: I-693 expired (only valid 2 years from exam date), missing vaccinations
4. PRIOR IMMIGRATION VIOLATIONS: Prior overstay, unauthorized employment, prior deportation
5. NAME DISCREPANCIES: Names don't match across documents — provide explanation letter
6. CRIMINAL HISTORY: Any arrest requires police clearance + disposition records
7. PRIOR MARRIAGES: Missing divorce decrees or death certificates
8. MISSING SIGNATURES: Unsigned forms are auto-rejected
9. WRONG FEES: Fee schedules change; verify at uscis.gov before filing
10. BIOMETRICS APPOINTMENT: Missing required biometrics appearance

=== PROCESSING TIMES ===

- I-130 standalone: 12-24 months (varies by field office)
- Concurrent I-130 / I-485 for USC petitioners: 12-24 months
- I-765 (EAD): issued ~5-7 months from filing or after I-485 interview
- I-131 (AP): issued ~5-7 months from filing

Always check current processing times at uscis.gov/tools/processing-times.

=== INTERVIEW ===

Most adjustment cases require an in-person interview at the local USCIS field office. Bring ALL originals + copies of everything submitted. Couples are typically interviewed together. Officers verify marriage is genuine through questions about daily life, household, finances, and relationship history.`;

export interface GuidanceRequest {
  step: string;
  question: string;
  partialIntake?: Partial<IntakeData>;
}

export interface GuidanceResponse {
  answer: string;
  citations?: string[];
}

export async function getStepGuidance(
  req: GuidanceRequest
): Promise<GuidanceResponse> {
  const contextNote = req.partialIntake
    ? `\n\nContext about this user's situation:\n- Petitioner citizenship: ${req.partialIntake.petitioner?.countryOfCitizenship ?? "unknown"}\n- Beneficiary country of birth: ${req.partialIntake.beneficiary?.countryOfBirth ?? "unknown"}\n- Step currently on: ${req.step}`
    : `\n\nStep currently on: ${req.step}`;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: USCIS_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `${req.question}${contextNote}\n\nPlease give a concise, practical answer (2-4 sentences). Be specific and actionable.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const answer = textBlock?.type === "text" ? textBlock.text : "";

  return { answer };
}

export async function analyzeRFERisks(
  intake: IntakeData
): Promise<RFERisk[]> {
  const summary = buildIntakeSummary(intake);

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: USCIS_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Analyze the following marriage-based green card case for RFE (Request for Evidence) risks. Return a JSON array of risk objects with fields: category (string), riskLevel ("low"|"medium"|"high"), reasoning (string), mitigation (string).

Case summary:
${summary}

Return ONLY valid JSON array, no markdown fences.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock?.type === "text" ? textBlock.text.trim() : "[]";

  try {
    return JSON.parse(raw) as RFERisk[];
  } catch {
    return [];
  }
}

export async function generateChecklist(
  intake: IntakeData
): Promise<ChecklistItem[]> {
  const summary = buildIntakeSummary(intake);

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 3000,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: USCIS_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Generate a complete document checklist for this marriage-based green card case. Return a JSON array where each item has: item (short name), required (boolean), description (string), tip (string, optional), category ("identity"|"marriage"|"financial"|"immigration"|"photos"|"other").

Include all required documents for both I-130 and I-485 concurrent filing, tailored to this specific case.

Case summary:
${summary}

Return ONLY valid JSON array, no markdown fences.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock?.type === "text" ? textBlock.text.trim() : "[]";

  try {
    return JSON.parse(raw) as ChecklistItem[];
  } catch {
    return [];
  }
}

export async function generateFilingInstructions(
  intake: IntakeData
): Promise<string> {
  const summary = buildIntakeSummary(intake);

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 3000,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: USCIS_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Generate clear, step-by-step filing instructions for this marriage-based green card case. Format as markdown with sections for: 1) Before You File, 2) How to Assemble Your Packet, 3) Where to Mail/File, 4) After You File, 5) Important Reminders. Be specific to this case.

Case summary:
${summary}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}

function buildIntakeSummary(intake: IntakeData): string {
  const { petitioner: p, beneficiary: b, marriage: m, background: bg, financial: f } = intake;
  return `
Petitioner: ${p.givenName} ${p.familyName}, USC by ${p.usCitizenshipHow}, lives in ${p.address.state ?? p.address.country}
Prior marriages (petitioner): ${p.priorMarriagesCount}
Beneficiary: ${b.givenName} ${b.familyName}, born in ${b.countryOfBirth}, citizen of ${b.countryOfCitizenship}
Beneficiary current status: ${b.currentImmigrationStatus ?? "not specified"}, last entry ${b.dateOfLastEntry ?? "unknown"}
Prior marriages (beneficiary): ${b.priorMarriagesCount}
Children: ${b.childrenCount}
Marriage: ${m.marriageDate} in ${m.marriageCity}, ${m.marriageCountry}
Joint assets: bank=${m.jointBankAccount}, lease=${m.jointLease}, cohabiting=${m.cohabitation}
Criminal history: petitioner=${bg.everArrestedPetitioner}, beneficiary=${bg.everArrestedBeneficiary}
Prior deportation/removal: ${bg.everDeportedBeneficiary || bg.everRemovedBeneficiary}
Visa denial history: ${bg.everDeniedVisaBeneficiary}
Petitioner income: $${f.petitionerAnnualIncome ?? "unknown"}/year, household size=${f.petitionerHouseholdSize}
Joint sponsor: ${f.hasJointSponsor}
  `.trim();
}
