import type { City, Item, PlannedDay } from './itineraries';
import { DEFAULT_META, VENUE_META, type VenueMeta } from './venue-meta';

export type Leg = {
  slot: 'morning' | 'afternoon' | 'evening';
  title: string;
  travelFromPrev: number;
  wait: number;
  arrival: number;
  end: number;
};

export type DayCheck = {
  day: number;
  weekday: number;
  feasible: boolean;
  warnings: string[];
  legs: Leg[];
};

export type PlanCheck = {
  days: DayCheck[];
  feasibleDays: number;
  totalWarnings: number;
};

const SLOT_START = { morning: 8 * 60, afternoon: 13 * 60, evening: 18 * 60 } as const;
const SLOT_LABEL = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' } as const;

export function toMinutes(value: string) {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

export function formatMinutes(value: number) {
  const v = ((value % 1440) + 1440) % 1440;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
}

function closeMinutes(meta: VenueMeta) {
  const open = toMinutes(meta.open);
  const close = toMinutes(meta.close);
  return close <= open ? close + 1440 : close;
}

function metaFor(item: Item): VenueMeta {
  return VENUE_META[item.title] ?? DEFAULT_META;
}

function haversineKm(a: VenueMeta, b: VenueMeta) {
  if (!a.lat || !b.lat) return 2;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Deterministic estimate: straight-line distance, urban speed, fixed buffer. */
export function travelMinutes(from: VenueMeta, to: VenueMeta) {
  const km = haversineKm(from, to);
  const speed = km > 12 ? 40 : 18;
  return Math.max(8, Math.round((km / speed) * 60 + 10));
}

export function validateDay(city: City, day: PlannedDay, date: string): DayCheck {
  const weekday = new Date(`${date}T12:00:00`).getDay();
  const warnings: string[] = [];
  const legs: Leg[] = [];
  let prevMeta: VenueMeta | null = null;
  let prevEnd = 0;

  (['morning', 'afternoon', 'evening'] as const).forEach((slot) => {
    const item = day[slot];
    const meta = metaFor(item);
    const open = toMinutes(meta.open);
    const close = closeMinutes(meta);
    const lastEntry = meta.lastEntry ? toMinutes(meta.lastEntry) : close - meta.duration;
    const latestStart = Math.min(close - meta.duration, lastEntry);

    const travel = prevMeta ? travelMinutes(prevMeta, meta) : 0;
    let arrival = Math.max(SLOT_START[slot], prevEnd + travel);
    let wait = 0;
    if (arrival < open) {
      wait = open - arrival;
      arrival = open;
    }

    if (meta.closedDays.includes(weekday)) {
      warnings.push(`${SLOT_LABEL[slot]}: ${item.title} is normally closed on this weekday.`);
    }
    if (arrival > latestStart) {
      warnings.push(
        `${SLOT_LABEL[slot]}: ${item.title} — arriving ${formatMinutes(arrival)} leaves less than ${meta.duration} min before closing (${meta.close}).`
      );
    }
    if (arrival + meta.duration > close) {
      warnings.push(`${SLOT_LABEL[slot]}: ${item.title} would run past closing at ${meta.close}.`);
    }
    if (travel >= 60) {
      warnings.push(`${SLOT_LABEL[slot]}: ${travel} min transfer to ${item.title}. Consider splitting the day.`);
    }

    legs.push({
      slot,
      title: item.title,
      travelFromPrev: travel,
      wait,
      arrival,
      end: arrival + meta.duration,
    });
    prevMeta = meta;
    prevEnd = arrival + meta.duration;
  });

  return { day: day.day, weekday, feasible: warnings.length === 0, warnings, legs };
}

export function validatePlan(city: City, days: PlannedDay[], date: string): PlanCheck {
  const checks = days.map((day) => validateDay(city, day, date));
  return {
    days: checks,
    feasibleDays: checks.filter((c) => c.feasible).length,
    totalWarnings: checks.reduce((sum, c) => sum + c.warnings.length, 0),
  };
}
