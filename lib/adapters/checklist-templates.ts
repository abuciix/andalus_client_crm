export type ChecklistTemplateItem = {
  label: string;
  required: boolean;
};

const ADDIS_ABABA_MOUDI: ChecklistTemplateItem[] = [
  { label: "Land holding certificate", required: true },
  { label: "EIA (Environmental Impact Assessment) approval", required: true },
  { label: "Geotechnical report", required: true },
  { label: "Site plan (survey drawing)", required: true },
  { label: "Structural design drawings", required: true },
  { label: "MoUDI building permit application form", required: true },
  { label: "Fire safety clearance", required: false },
];

const REGIONAL_DEFAULT: ChecklistTemplateItem[] = [
  { label: "Land holding certificate", required: true },
  { label: "Regional EIA clearance", required: true },
  { label: "Site plan (survey drawing)", required: true },
  { label: "Structural design drawings", required: true },
  { label: "Regional administration building permit application", required: true },
];

const CHECKLISTS_BY_CITY: Record<string, ChecklistTemplateItem[]> = {
  "Addis Ababa": ADDIS_ABABA_MOUDI,
};

// TODO: replace with real jurisdiction data as more regional administrations are onboarded.
export function getChecklistForCity(city: string): ChecklistTemplateItem[] {
  return CHECKLISTS_BY_CITY[city] ?? REGIONAL_DEFAULT;
}
