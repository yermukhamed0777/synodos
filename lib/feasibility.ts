import type { PlannedDay } from './itineraries';
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
  date: string;
  weekday: number;
  feasible: boolean;
  /** Constraints that make the day impossible. */
  hard: string[];
  /** Worth knowing, but the day is still possible. */
  advisories: string[];
  /** hard + advisories, retained for the existing UI. */
  warnings: string[];
  legs: Leg[];
};

export type PlanCheck = {
  days: DayCheck[];
  feasibleDays: number;
  totalWarnings: number;
  totalHard: number;
};

const SLOT_START = { morning: 8 * 60, afternoon: 13 * 60, evening: 18 * 60 } as const;
const SLOT_LABEL = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' } as const;
export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
/** Transfers at or above this length are advisory, not impossible. */
export const LONG_TRANSFER_MINUTES = 60;

export function toMinutes(value: string) {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

export function formatMinutes(value: number) {
  const v = ((value % 1440) + 1440) % 1440;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
}

/** UTC noon anchors avoid DST shifting a calendar date backwards or forwards. */
export function dateForDay(startDate: string, index: number) {
  const base = new Date(`${startDate}T12:00:00Z`);
  base.setUTCDate(base.getUTCDate() + index);
  return base.toISOString().slice(0, 10);
}

export function weekdayForDate(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

function closeMinutes(meta: VenueMeta) {
  const open = toMinutes(meta.open);
  const close = toMinutes(meta.close);
  return close <= open ? close + 1440 : close;
}

function metaFor(item: PlannedDay['morning']): VenueMeta {
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

/** Validate one day against the date that day actually falls on. */
export function validateDay(day: PlannedDay, date: string): DayCheck {
  const weekday = weekdayForDate(date);
  const hard: string[] = [];
  const advisories: string[] = [];
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
    const lastEntryBinds = Boolean(meta.lastEntry) && lastEntry < close - meta.duration;

    const travel = prevMeta ? travelMinutes(prevMeta, meta) : 0;
    let arrival = Math.max(SLOT_START[slot], prevEnd + travel);
    let wait = 0;
    if (arrival < open) {
      wait = open - arrival;
      arrival = open;
    }

    if (meta.closedDays.includes(weekday)) {
      hard.push(
        `${SLOT_LABEL[slot]}: ${item.title} is closed on ${WEEKDAY_NAMES[weekday]} — this day needs a different stop.`
      );
    }
    if (arrival > latestStart) {
      hard.push(
        lastEntryBinds
          ? `${SLOT_LABEL[slot]}: arriving ${formatMinutes(arrival)} is after last entry ${meta.lastEntry} at ${item.title}.`
          : `${SLOT_LABEL[slot]}: ${item.title} — arriving ${formatMinutes(arrival)} leaves less than ${meta.duration} min before closing (${meta.close}).`
      );
    }
    if (arrival + meta.duration > close) {
      hard.push(`${SLOT_LABEL[slot]}: ${item.title} would run past closing at ${meta.close}.`);
    }
    if (travel >= LONG_TRANSFER_MINUTES) {
      advisories.push(
        `${SLOT_LABEL[slot]}: ${travel} min transfer to ${item.title}. Long but possible — check live transit before you go.`
      );
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

  return {
    day: day.day,
    date,
    weekday,
    feasible: hard.length === 0,
    hard,
    advisories,
    warnings: [...hard, ...advisories],
    legs,
  };
}

export function validatePlan(days: PlannedDay[], startDate: string): PlanCheck {
  const checks = days.map((day, index) => validateDay(day, dateForDay(startDate, index)));
  return {
    days: checks,
    feasibleDays: checks.filter((c) => c.feasible).length,
    totalWarnings: checks.reduce((sum, c) => sum + c.warnings.length, 0),
    totalHard: checks.reduce((sum, c) => sum + c.hard.length, 0),
  };
}
