import { CITIES, maxDaysFor, SLOTS, type City, type PlannedDay } from './itineraries';

export const SAVED_PLAN_KEY = 'synodos_saved_plan_v1';

export type SavedPlan = { city: City; days: PlannedDay[]; travellers: number };

type WireFormat = {
  v: number;
  cityId: string;
  days: PlannedDay[];
  travellers: number;
};

/** Serialise only the city id + plan shape, so curated data stays authoritative on load. */
export function serializeSavedPlan(plan: SavedPlan): string {
  const wire: WireFormat = {
    v: 1,
    cityId: plan.city.id,
    days: plan.days,
    travellers: plan.travellers,
  };
  return JSON.stringify(wire);
}

/** Reject anything that is not a v1 payload made only of known cities and stops. */
export function parseSavedPlan(raw: string | null): SavedPlan | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<WireFormat>;
    if (value.v !== 1 || typeof value.cityId !== 'string') return null;
    const city = CITIES.find((c) => c.id === value.cityId);
    if (!city || !Array.isArray(value.days)) return null;
    if (value.days.length < 2 || value.days.length > maxDaysFor(city)) return null;
    if (
      typeof value.travellers !== 'number' ||
      !Number.isInteger(value.travellers) ||
      value.travellers < 1 ||
      value.travellers > 4
    ) return null;

    value.days.forEach((day, i) => {
      if (!day || typeof day !== 'object') throw new Error('bad day');
      const record = day as unknown as Record<string, unknown>;
      if (record.day !== i + 1) throw new Error('bad day number');
      SLOTS.forEach((slot) => {
        const item = record[slot] as { title?: unknown } | undefined;
        if (!item || typeof item.title !== 'string') throw new Error('bad item');
        if (!city.items.some((known) => known.title === item.title)) throw new Error('unknown stop');
      });
    });

    return { city, days: value.days, travellers: value.travellers };
  } catch {
    return null;
  }
}
