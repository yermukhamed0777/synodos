export const SITE = {
  name: 'Synodos',
  tagline: 'The AI companion for the whole journey.',
  url: 'https://synodos.app',
  description:
    'Synodos is an AI travel companion that lives on your phone — before, during and after every trip. Plan less. Notice more.',
} as const;

export const NAV_ITEMS = [
  { label: 'Idea', href: '#idea' },
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'Business', href: '#business' },
] as const;

export const STEPS = [
  {
    num: '01',
    title: 'It notices',
    body: 'You start looking at flights, dates, a city. Synodos shows up with the useful bits already gathered.',
  },
  {
    num: '02',
    title: 'It stays close',
    body: 'Gate changes, delays, a better route, a reminder before you leave. Right thing, right moment.',
  },
  {
    num: '03',
    title: 'It remembers',
    body: 'After the trip, the good parts stay — places, names, notes. Your next journey starts smarter.',
  },
] as const;

export const PILLARS = [
  {
    num: '/01',
    icon: '+',
    title: 'Plan',
    body: 'One place for the decisions that actually matter. No tabs, no spreadsheets, no second-guessing.',
    tone: 'red' as const,
  },
  {
    num: '/02',
    icon: '~',
    title: 'Move',
    body: 'Live changes arrive as plain instructions. You keep moving while Synodos handles the details.',
    tone: 'plain' as const,
  },
  {
    num: '/03',
    icon: '#',
    title: 'Remember',
    body: 'A quiet record of where you went and what was worth keeping. Yours, not an algorithm’s.',
    tone: 'purple' as const,
  },
] as const;

export const FEATURES = [
  {
    id: 'F1',
    title: 'Trip sense',
    body: 'Picks up on planning behaviour and offers help before you have to ask.',
  },
  {
    id: 'F2',
    title: 'Live updates',
    body: 'Delays, gates and route changes, delivered as short actionable notes.',
  },
  {
    id: 'F3',
    title: 'Place memory',
    body: 'Keeps a personal log of spots, meals and names worth returning to.',
  },
  {
    id: 'F4',
    title: 'One companion',
    body: 'It learns your pace and rhythms instead of resetting every trip.',
  },
  {
    id: 'F5',
    title: 'Less noise',
    body: 'No feed, no streaks, no nudges. It speaks when there is something to say.',
  },
] as const;

export const BUSINESS_POINTS = [
  '01 — Concierge without a desk',
  '02 — Travel policy in plain language',
  '03 — One companion across every trip',
  '04 — Private by default, always',
] as const;
