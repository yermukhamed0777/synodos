import { CITIES, maxDaysFor, type City } from './itineraries';

export type PlannerInput = {
  cityId: string;
  startDate: string;
  days: number;
  travellers: number;
};

export type InputCheck = { ok: true; city: City } | { ok: false; message: string };

/** Strict YYYY-MM-DD calendar date, including real leap days. */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validatePlannerInput(input: PlannerInput): InputCheck {
  const city = CITIES.find((c) => c.id === input.cityId);
  if (!city) return { ok: false, message: 'Choose one of the supported cities.' };
  if (!isIsoDate(input.startDate))
    return { ok: false, message: 'Enter a real start date as YYYY-MM-DD.' };
  if (!Number.isInteger(input.days) || input.days < 2 || input.days > maxDaysFor(city))
    return {
      ok: false,
      message: `${city.name} has curated coverage for 2 to ${maxDaysFor(city)} days only.`,
    };
  if (!Number.isInteger(input.travellers) || input.travellers < 1 || input.travellers > 4)
    return { ok: false, message: 'Choose between 1 and 4 travellers.' };
  return { ok: true, city };
}
