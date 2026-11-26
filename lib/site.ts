/** Inlined at build time; matches `basePath` in next.config.ts. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/synodos';

export const asset = (file: string) => `${BASE_PATH}/assets/images/${file}`;

export const SITE = {
  name: 'Synodos',
  tagline: 'The deterministic travel planner for the whole journey.',
  url: 'https://yermukhamed0777.github.io/synodos/',
  description:
    'Synodos is a deterministic travel planner over a curated, human-checked dataset. Build a day-by-day draft, check its timing and change one day without losing the rest.',
} as const;

export const NAV_ITEMS = [
  { label: 'Journey', href: '#journey' },
  { label: 'Experience', href: '#experience' },
  { label: 'Technology', href: '#technology' },
  { label: 'Vision', href: '#vision' },
  { label: 'About', href: '#about' },
] as const;

export const TRUST_NOTE = 'Private beta · Concept preview · No live booking yet';

export const HERO_ALERTS = [
  { id: 'flight', icon: 'flight', title: 'Flight to Tokyo', detail: 'JL 520 · 12 Apr · 18:30', status: 'On time', tone: 'red' as const },
  { id: 'hotel', icon: 'hotel', title: 'Hotel Confirmed', detail: 'Shibuya Sky Hotel · 12–20 Apr', status: 'Booked', tone: 'purple' as const },
  { id: 'weather', icon: 'weather', title: 'Weather in Tokyo', detail: '18° · Light rain · 12 Apr, 16:20', status: 'Heads up', tone: 'neutral' as const },
] as const;

export const TRIP_ROWS = [
  { label: 'Visa', value: 'Approved', tone: 'red' as const },
  { label: 'Activities', value: '8 booked', tone: 'purple' as const },
  { label: 'Budget', value: 'On track', tone: 'neutral' as const },
] as const;

export const FEATURE_BAR = [
  { icon: 'spark', title: 'Grounded', body: 'Plans come from a curated city dataset, not model memory.' },
  { icon: 'clock', title: 'Budget-aware', body: 'Every stop carries an estimated cost before you commit.' },
  { icon: 'globe', title: 'Rebuild one day', body: 'Change a single day without losing the rest of the trip.' },
  { icon: 'shield', title: 'Private by default', body: 'No feed, no tracking, no resale of your plans.' },
] as const;

export const TECHNOLOGY_STEPS = [
  { num: '01', title: 'Choose', body: 'You supply a city, dates, group size and what you care about.' },
  { num: '02', title: 'Ground', body: 'Stops come from a curated, human-checked dataset — never model memory or live inventory.' },
  { num: '03', title: 'Validate', body: 'Curated opening hours, last entry and straight-line transfer estimates are checked locally.' },
  { num: '04', title: 'Keep', body: 'Rebuild one day without losing the rest. In-trip disruption handling is future work.' },
] as const;

export const VISION_POINTS = [
  'One companion before, during and after every trip',
  'Answers grounded in real inventory and real timing',
  'Private by default — your journey stays yours',
  'Built for the moments that actually matter',
] as const;
