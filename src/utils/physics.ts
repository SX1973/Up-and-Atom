const MWH_PER_GRAM_U235 = 8;
const CO2_PER_KWH_COAL = 0.82;
const COAL_KG_PER_KWH = 0.35;

export interface CarbonResult {
  annualCO2Kg: number; u235Grams: number; coalKg: number; treesEquivalent: number;
}

export function calculateCarbon(
  dailyKm: number, vehicleType: 'gasoline' | 'electric' | 'hybrid',
  monthlyKwh: number, yearlyFlights: number
): CarbonResult {
  const co2PerKm: Record<string, number> = { gasoline: 0.2, electric: 0.05, hybrid: 0.12 };
  const transportCO2 = dailyKm * 365 * co2PerKm[vehicleType];
  const electricityCO2 = monthlyKwh * 12 * 0.5;
  const flightCO2 = yearlyFlights * 2000 * 0.115;
  const annualCO2Kg = transportCO2 + electricityCO2 + flightCO2;
  const kwhEquivalent = annualCO2Kg / CO2_PER_KWH_COAL;
  const u235Grams = kwhEquivalent / (MWH_PER_GRAM_U235 * 1000);
  const coalKg = kwhEquivalent * COAL_KG_PER_KWH;
  const treesEquivalent = Math.round(annualCO2Kg / 21);
  return { annualCO2Kg, u235Grams, coalKg, treesEquivalent };
}
