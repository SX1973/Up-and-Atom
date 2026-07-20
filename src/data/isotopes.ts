export interface Isotope {
  id: string; name: string; halfLife: string; use: string; annualOutput: string; patientsPerYear: string; currentSupply: string;
}

export const isotopes: Isotope[] = [
  { id: 'mo99',  name: 'Mo-99 (Molybdenum-99)',   halfLife: '66 h', use: 'SPECT myocardial perfusion imaging, bone scans, cancer staging', annualOutput: '500 Ci/yr', patientsPerYear: '~20,000 exams/yr', currentSupply: '90%+ of SE Asia market relies on EU/US imports with severe decay losses in transit' },
  { id: 'lu177', name: 'Lu-177 (Lutetium-177)',   halfLife: '6.65 d', use: 'Targeted radionuclide therapy — PSMA prostate cancer, neuroendocrine tumors', annualOutput: '200 Ci/yr', patientsPerYear: '~800 treatments/yr', currentSupply: 'Global shortage; production lines under extreme strain' },
  { id: 'i131',  name: 'I-131 (Iodine-131)',      halfLife: '8.02 d', use: 'Post-thyroidectomy ablation, hyperthyroidism radiotherapy', annualOutput: '300 Ci/yr', patientsPerYear: '~5,000 treatments/yr', currentSupply: 'Russia is the primary supplier; long supply chains to SE Asia' },
];

export const supplyChain = [
  { city: 'Bangkok',    lat: 13.756, lng: 100.502, flightHours: 3,   country: 'Thailand' },
  { city: 'Hanoi',      lat: 21.028, lng: 105.854, flightHours: 2,   country: 'Vietnam' },
  { city: 'Jakarta',    lat: -6.209, lng: 106.846, flightHours: 5,   country: 'Indonesia' },
  { city: 'Manila',     lat: 14.600, lng: 120.984, flightHours: 3,   country: 'Philippines' },
  { city: 'Kuala Lumpur', lat: 3.139,  lng: 101.687, flightHours: 3.5, country: 'Malaysia' },
  { city: 'Singapore',  lat: 1.352,  lng: 103.820, flightHours: 4,   country: 'Singapore' },
];

export const changjiangCoords = { lat: 19.459, lng: 108.723 };
