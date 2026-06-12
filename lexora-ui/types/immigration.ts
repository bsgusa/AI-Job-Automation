export interface PetitionerInfo {
  familyName: string;
  givenName: string;
  middleName?: string;
  otherNames?: string; // prior names, maiden names
  dateOfBirth: string; // YYYY-MM-DD
  placeOfBirth: string;
  countryOfBirth: string;
  countryOfCitizenship: string;
  ssn?: string;
  alienRegNumber?: string;
  usCitizenshipHow: "birth" | "naturalization" | "parents";
  naturalizationNumber?: string;
  naturalizationDate?: string;
  address: Address;
  mailingAddress?: Address;
  phone: string;
  email: string;
  priorMarriagesCount: number;
  priorMarriages?: PriorMarriage[];
}

export interface BeneficiaryInfo {
  familyName: string;
  givenName: string;
  middleName?: string;
  otherNames?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  countryOfBirth: string;
  countryOfCitizenship: string;
  alienRegNumber?: string;
  i94Number?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  currentImmigrationStatus?: string;
  dateOfLastEntry?: string;
  portOfEntry?: string;
  visaClass?: string;
  currentAddress: Address;
  phone: string;
  email: string;
  priorMarriagesCount: number;
  priorMarriages?: PriorMarriage[];
  childrenCount: number;
  children?: ChildInfo[];
  // I-485 specific
  hasSSN: boolean;
  ssn?: string;
  employerName?: string;
  employerAddress?: Address;
  occupation?: string;
}

export interface MarriageDetails {
  marriageDate: string;
  marriageCity: string;
  marriageState?: string;
  marriageCountry: string;
  ceremonyType: "civil" | "religious" | "other";
  officiantName?: string;
  witnessNames?: string[];
  // For bona fide evidence
  jointAssets: boolean;
  jointBankAccount: boolean;
  jointLease: boolean;
  cohabitation: boolean;
  sharedExpenses: boolean;
  hasChildren: boolean;
  additionalEvidence?: string;
}

export interface BackgroundInfo {
  // Criminal history
  everArrestedPetitioner: boolean;
  everArrestedBeneficiary: boolean;
  arrestDetailsPetitioner?: string;
  arrestDetailsBeneficiary?: string;
  // Immigration history
  everDeportedBeneficiary: boolean;
  everRemovedBeneficiary: boolean;
  deportationDetails?: string;
  everDeniedVisaBeneficiary: boolean;
  visaDenialDetails?: string;
  everViolatedImmigrationLaw: boolean;
  immigrationViolationDetails?: string;
  // Health
  hasPhysicalExam: boolean;
  // Military
  everServedMilitaryPetitioner: boolean;
  militaryDetails?: string;
}

export interface FinancialInfo {
  petitionerEmploymentStatus: "employed" | "self_employed" | "unemployed" | "retired" | "student";
  petitionerEmployerName?: string;
  petitionerOccupation?: string;
  petitionerAnnualIncome?: number;
  petitionerHouseholdSize: number;
  hasJointSponsor: boolean;
  jointSponsorName?: string;
  jointSponsorRelationship?: string;
  // Assets (if income insufficient)
  realPropertyValue?: number;
  savingsValue?: number;
  stocksValue?: number;
}

export interface Address {
  street: string;
  apt?: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface PriorMarriage {
  spouseName: string;
  marriageDate: string;
  terminationDate: string;
  terminationHow: "divorce" | "annulment" | "death";
  terminationCity: string;
  terminationCountry: string;
}

export interface ChildInfo {
  familyName: string;
  givenName: string;
  dateOfBirth: string;
  countryOfBirth: string;
  alienRegNumber?: string;
  relationship: "biological" | "adopted" | "stepchild";
  currentAddress?: Address;
  includingInApplication: boolean;
}

export interface IntakeData {
  petitioner: PetitionerInfo;
  beneficiary: BeneficiaryInfo;
  marriage: MarriageDetails;
  background: BackgroundInfo;
  financial: FinancialInfo;
  completedAt?: string;
}

export interface MarriageCase {
  id: string;
  userId?: string;
  email: string;
  stripeSessionId: string;
  status: "pending_payment" | "paid" | "intake_complete" | "generating" | "complete" | "error";
  intakeData?: IntakeData;
  generatedPacketPath?: string;
  checklist?: ChecklistItem[];
  rfeRisks?: RFERisk[];
  filingInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  item: string;
  required: boolean;
  description: string;
  tip?: string;
  category: "identity" | "marriage" | "financial" | "immigration" | "photos" | "other";
}

export interface RFERisk {
  category: string;
  riskLevel: "low" | "medium" | "high";
  reasoning: string;
  mitigation: string;
}

export type IntakeStep =
  | "petitioner"
  | "beneficiary"
  | "marriage"
  | "background"
  | "financial"
  | "review";

export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
