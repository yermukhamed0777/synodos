export type Slot = 'morning' | 'afternoon' | 'evening';

export type Interest = 'food' | 'culture' | 'nature' | 'nightlife' | 'shopping' | 'relax';

export type Item = {
  title: string;
  detail: string;
  slot: Slot;
  tags: Interest[];
  price: number;
};

export type City = {
  id: string;
  name: string;
  country: string;
  tagline: string;
  currency: string;
  dailyBudget: number;
  items: Item[];
};

export const INTERESTS: { id: Interest; label: string }[] = [
  { id: 'food', label: 'Food' },
  { id: 'culture', label: 'Culture' },
  { id: 'nature', label: 'Nature' },
  { id: 'nightlife', label: 'Nightlife' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'relax', label: 'Slow travel' },
];

export const CITIES: City[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    tagline: 'Neon calm, old temples, late-night noodles.',
    currency: 'JPY',
    dailyBudget: 145,
    items: [
      { title: 'Tsukiji outer market breakfast', detail: 'Tamago skewers, uni and a standing counter coffee before the crowds.', slot: 'morning', tags: ['food', 'culture'], price: 18 },
      { title: 'Meiji Jingu forest walk', detail: 'Cedar avenue into the shrine, then a quiet loop through Yoyogi Park.', slot: 'morning', tags: ['nature', 'culture', 'relax'], price: 0 },
      { title: 'Kappabashi kitchen street', detail: 'Knives, ceramics and the sample-food shops of Asakusa.', slot: 'morning', tags: ['shopping', 'culture'], price: 5 },
      { title: 'TeamLab Planets', detail: 'Barefoot digital rooms; book the first slot to avoid queues.', slot: 'afternoon', tags: ['culture'], price: 26 },
      { title: 'Yanaka backstreets', detail: 'Low-rise Tokyo, tiny galleries and a cemetery lined with cherry trees.', slot: 'afternoon', tags: ['culture', 'relax'], price: 0 },
      { title: 'Shibuya to Daikanyama walk', detail: 'Crossing, then side streets downhill into bookshops and coffee.', slot: 'afternoon', tags: ['shopping', 'food'], price: 8 },
      { title: 'Yakitori alley, Shinjuku', detail: 'Six-seat counters under the tracks; order by skewer.', slot: 'evening', tags: ['food', 'nightlife'], price: 32 },
      { title: 'Golden Gai bar hop', detail: 'Two or three tiny bars, one drink each, talk to the owner.', slot: 'evening', tags: ['nightlife', 'food'], price: 28 },
      { title: 'Onsen and early night', detail: 'A neighbourhood sento, then convenience-store desserts in the room.', slot: 'evening', tags: ['relax', 'culture'], price: 12 },
    ],
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    tagline: 'Tiled hills, Atlantic light, custard tarts.',
    currency: 'EUR',
    dailyBudget: 105,
    items: [
      { title: 'Miradouro da Graça sunrise', detail: 'The city before the tour groups, with a coffee from the kiosk.', slot: 'morning', tags: ['relax', 'culture'], price: 3 },
      { title: 'Alfama market breakfast', detail: 'Pastéis de nata and a galão in a tiled corner café.', slot: 'morning', tags: ['food', 'culture'], price: 7 },
      { title: 'LX Factory browse', detail: 'Bookshops, print studios and rooftop views under the bridge.', slot: 'morning', tags: ['shopping', 'culture'], price: 0 },
      { title: 'Belém and the river', detail: 'Jerónimos cloisters, then walk the waterfront to the tower.', slot: 'afternoon', tags: ['culture', 'nature'], price: 12 },
      { title: 'Sintra day trip', detail: 'Train out, Quinta da Regaleira wells, back before dinner.', slot: 'afternoon', tags: ['nature', 'culture'], price: 28 },
      { title: 'Time Out Market tasting', detail: 'One small plate from three different counters.', slot: 'afternoon', tags: ['food'], price: 22 },
      { title: 'Fado in Mouraria', detail: 'A small room, two singers, no amplification.', slot: 'evening', tags: ['culture', 'nightlife'], price: 25 },
      { title: 'Bairro Alto rooftop', detail: 'Sunset over the Tagus, then bar-hop downhill.', slot: 'evening', tags: ['nightlife', 'relax'], price: 18 },
      { title: 'Cais do Sodré seafood', detail: 'Grilled sardines and vinho verde at a standing counter.', slot: 'evening', tags: ['food'], price: 24 },
    ],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    tagline: 'Rice terraces, reef breaks, long slow afternoons.',
    currency: 'IDR',
    dailyBudget: 78,
    items: [
      { title: 'Tegallalang terrace walk', detail: 'Start at 7am, walk the ridge path before the heat and buses.', slot: 'morning', tags: ['nature', 'relax'], price: 6 },
      { title: 'Ubud morning market', detail: 'Fruit, incense and offerings; breakfast at a warung nearby.', slot: 'morning', tags: ['food', 'culture'], price: 5 },
      { title: 'Sunrise surf lesson', detail: 'Soft-top and a local instructor at Batu Bolong.', slot: 'morning', tags: ['nature', 'relax'], price: 22 },
      { title: 'Temple and water blessing', detail: 'Tirta Empul with a guide who explains the ritual properly.', slot: 'afternoon', tags: ['culture', 'relax'], price: 15 },
      { title: 'Scooter to a hidden beach', detail: 'South coast limestone coves; go early and carry water.', slot: 'afternoon', tags: ['nature'], price: 10 },
      { title: 'Canggu café afternoon', detail: 'Work, read, swim; the point is to do very little.', slot: 'afternoon', tags: ['relax', 'food'], price: 12 },
      { title: 'Jimbaran seafood grill', detail: 'Tables on the sand, snapper and sambal, bare feet.', slot: 'evening', tags: ['food'], price: 26 },
      { title: 'Kecak dance at Uluwatu', detail: 'Cliff temple at sunset, then dinner on the way back.', slot: 'evening', tags: ['culture'], price: 18 },
      { title: 'Beach club sunset', detail: 'One drink, a lounger and the indian ocean going dark.', slot: 'evening', tags: ['nightlife', 'relax'], price: 20 },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    tagline: 'Bakery mornings, long walks, one perfect museum.',
    currency: 'EUR',
    dailyBudget: 165,
    items: [
      { title: 'Boulangerie breakfast', detail: 'Croissant, pain au chocolat, a bench in a small square.', slot: 'morning', tags: ['food', 'relax'], price: 8 },
      { title: 'Marché d’Aligre', detail: 'Cheese, olives and a coffee among the market stalls.', slot: 'morning', tags: ['food', 'culture'], price: 10 },
      { title: 'Montmartre before crowds', detail: 'Up the side streets, down through the vineyard.', slot: 'morning', tags: ['culture', 'relax'], price: 0 },
      { title: 'One museum, properly', detail: 'Pick Orsay or l’Orangerie; two hours, one wing, no rush.', slot: 'afternoon', tags: ['culture'], price: 16 },
      { title: 'Seine walk to Île Saint-Louis', detail: 'Booksellers, bridges, an ice cream on the way.', slot: 'afternoon', tags: ['relax', 'culture'], price: 5 },
      { title: 'Le Marais browsing', detail: 'Vintage, concept stores and a falafel stop.', slot: 'afternoon', tags: ['shopping', 'food'], price: 14 },
      { title: 'Natural wine bar', detail: 'A small list, a plate of comté, no reservation needed early.', slot: 'evening', tags: ['food', 'nightlife'], price: 30 },
      { title: 'Canal Saint-Martin picnic', detail: 'Bread, cheese and a bottle from the corner shop.', slot: 'evening', tags: ['relax', 'food'], price: 18 },
      { title: 'Jazz cellar in Saint-Germain', detail: 'Tight room, late set, one drink minimum.', slot: 'evening', tags: ['nightlife', 'culture'], price: 24 },
    ],
  },
];

export type PlannedDay = {
  day: number;
  morning: Item;
  afternoon: Item;
  evening: Item;
};

export function buildItinerary(city: City, nights: number, interests: Interest[]): PlannedDay[] {
  const score = (item: Item) => item.tags.filter((t) => interests.includes(t)).length;
  const slots: Slot[] = ['morning', 'afternoon', 'evening'];
  const used = new Set<string>();
  const days: PlannedDay[] = [];

  for (let d = 0; d < nights; d += 1) {
    const picks: Record<Slot, Item> = {} as Record<Slot, Item>;
    slots.forEach((slot) => {
      const pool = city.items
        .filter((i) => i.slot === slot && !used.has(i.title))
        .sort((a, b) => score(b) - score(a) || a.price - b.price);
      const fallback = city.items.filter((i) => i.slot === slot);
      const chosen = pool[0] ?? fallback[d % fallback.length];
      used.add(chosen.title);
      picks[slot] = chosen;
    });
    days.push({ day: d + 1, ...picks });
  }
  return days;
}

export function estimateBudget(city: City, days: number, travellers: number) {
  const low = Math.round(city.dailyBudget * days * travellers * 0.8);
  const high = Math.round(city.dailyBudget * days * travellers * 1.35);
  return { low, high, currency: city.currency };
}

export function itineraryToMarkdown(city: City, days: PlannedDay[], travellers: number) {
  const lines = [
    `# Synodos — ${city.name}, ${city.country}`,
    `${days.length} days · ${travellers} traveller${travellers > 1 ? 's' : ''}`,
    '',
  ];
  days.forEach((d) => {
    lines.push(`## Day ${d.day}`);
    lines.push(`- Morning: ${d.morning.title} — ${d.morning.detail}`);
    lines.push(`- Afternoon: ${d.afternoon.title} — ${d.afternoon.detail}`);
    lines.push(`- Evening: ${d.evening.title} — ${d.evening.detail}`);
    lines.push('');
  });
  lines.push('Draft plan generated by the Synodos prototype. Verify opening hours and prices before booking.');
  return lines.join('\n');
}
