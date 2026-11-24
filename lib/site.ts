export const BASE_PATH = '/synodos';

export const asset = (file: string) => `${BASE_PATH}/assets/images/${file}`;

export const SITE = {
  name: 'Synodos',
  tagline: 'The AI companion for the whole journey.',
  url: 'https://yermukhamed0777.github.io/synodos/',
  description:
    'Synodos is an AI travel companion that lives on your phone — before, during and after every trip. Plan less. Notice more.',
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

export const JOURNEY_ALERTS = [
  { icon: 'visa', title: 'Visa Approved', detail: 'Japan eVisa', status: 'Approved' },
  { icon: 'weather', title: 'Heavy rain tomorrow', detail: 'Don’t forget your umbrella' },
  { icon: 'food', title: 'Local restaurant found', detail: 'Sushi Kai · 4.8 · 500m from you' },
  { icon: 'transit', title: 'Metro is faster than taxi', detail: 'Save 18 min · View route' },
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
  { num: '01', title: 'Notice', body: 'Synodos picks up on the trip you are planning and gathers the useful context.' },
  { num: '02', title: 'Ground', body: 'Recommendations are checked against real places, hours, weather and routes.' },
  { num: '03', title: 'Validate', body: 'Timings and connections are checked before anything reaches you.' },
  { num: '04', title: 'Stay', body: 'Disruptions are handled in the moment, with a clear next action.' },
] as const;

export const VISION_POINTS = [
  'One companion before, during and after every trip',
  'Answers grounded in real inventory and real timing',
  'Private by default — your journey stays yours',
  'Built for the moments that actually matter',
] as const;
