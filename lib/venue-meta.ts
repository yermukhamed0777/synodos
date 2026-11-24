export type VenueMeta = {
  lat: number;
  lng: number;
  /** Typical visit length in minutes. */
  duration: number;
  /** Local opening time, HH:MM. */
  open: string;
  /** Local closing time, HH:MM. */
  close: string;
  /** 0 = Sunday … 6 = Saturday. */
  closedDays: number[];
  /** Optional last entry time, HH:MM. */
  lastEntry?: string;
};

/**
 * Curated venue metadata, checked 2026-11-24.
 * Hours are typical published hours, not live data. Always confirm before travel.
 */
export const VENUE_META: Record<string, VenueMeta> = {
  // Tokyo
  'Tsukiji outer market breakfast': { lat: 35.6655, lng: 139.7708, duration: 90, open: '06:00', close: '13:00', closedDays: [0] },
  'Meiji Jingu forest walk': { lat: 35.6764, lng: 139.6993, duration: 90, open: '06:40', close: '17:00', closedDays: [] },
  'Kappabashi kitchen street': { lat: 35.7148, lng: 139.7869, duration: 75, open: '09:00', close: '17:00', closedDays: [0] },
  'TeamLab Planets': { lat: 35.6491, lng: 139.79, duration: 120, open: '09:00', close: '22:00', closedDays: [], lastEntry: '21:00' },
  'Yanaka backstreets': { lat: 35.7275, lng: 139.766, duration: 120, open: '00:00', close: '23:59', closedDays: [] },
  'Shibuya to Daikanyama walk': { lat: 35.658, lng: 139.7016, duration: 120, open: '00:00', close: '23:59', closedDays: [] },
  'Yakitori alley, Shinjuku': { lat: 35.6938, lng: 139.7034, duration: 90, open: '17:00', close: '23:30', closedDays: [0] },
  'Golden Gai bar hop': { lat: 35.6938, lng: 139.7034, duration: 120, open: '19:00', close: '02:00', closedDays: [] },
  'Onsen and early night': { lat: 35.7148, lng: 139.7967, duration: 90, open: '10:00', close: '23:00', closedDays: [] },

  // Lisbon
  'Miradouro da Graça sunrise': { lat: 38.7167, lng: -9.131, duration: 45, open: '00:00', close: '23:59', closedDays: [] },
  'Alfama market breakfast': { lat: 38.711, lng: -9.13, duration: 60, open: '07:00', close: '14:00', closedDays: [0] },
  'LX Factory browse': { lat: 38.7033, lng: -9.1786, duration: 90, open: '10:00', close: '20:00', closedDays: [1] },
  'Belém and the river': { lat: 38.6979, lng: -9.2063, duration: 150, open: '10:00', close: '18:00', closedDays: [1] },
  'Sintra day trip': { lat: 38.797, lng: -9.387, duration: 300, open: '09:00', close: '18:00', closedDays: [] },
  'Time Out Market tasting': { lat: 38.7069, lng: -9.1458, duration: 90, open: '10:00', close: '23:00', closedDays: [] },
  'Fado in Mouraria': { lat: 38.7139, lng: -9.135, duration: 90, open: '20:00', close: '01:00', closedDays: [1] },
  'Bairro Alto rooftop': { lat: 38.7128, lng: -9.1454, duration: 120, open: '17:00', close: '00:00', closedDays: [] },
  'Cais do Sodré seafood': { lat: 38.7069, lng: -9.1458, duration: 90, open: '12:00', close: '23:00', closedDays: [1] },

  // Bali
  'Tegallalang terrace walk': { lat: -8.4312, lng: 115.279, duration: 120, open: '06:00', close: '18:00', closedDays: [] },
  'Ubud morning market': { lat: -8.5069, lng: 115.2625, duration: 75, open: '06:00', close: '18:00', closedDays: [] },
  'Sunrise surf lesson': { lat: -8.6553, lng: 115.129, duration: 120, open: '06:00', close: '10:00', closedDays: [] },
  'Temple and water blessing': { lat: -8.4156, lng: 115.3153, duration: 120, open: '08:00', close: '18:00', closedDays: [] },
  'Scooter to a hidden beach': { lat: -8.79, lng: 115.13, duration: 180, open: '00:00', close: '23:59', closedDays: [] },
  'Canggu café afternoon': { lat: -8.6478, lng: 115.1385, duration: 120, open: '07:00', close: '22:00', closedDays: [] },
  'Jimbaran seafood grill': { lat: -8.7906, lng: 115.165, duration: 120, open: '17:00', close: '23:00', closedDays: [] },
  'Kecak dance at Uluwatu': { lat: -8.8291, lng: 115.0849, duration: 90, open: '17:00', close: '19:00', closedDays: [] },
  'Beach club sunset': { lat: -8.69, lng: 115.16, duration: 180, open: '10:00', close: '00:00', closedDays: [] },

  // Paris
  'Boulangerie breakfast': { lat: 48.8566, lng: 2.3522, duration: 45, open: '07:00', close: '14:00', closedDays: [1] },
  'Marché d’Aligre': { lat: 48.8496, lng: 2.378, duration: 60, open: '07:30', close: '13:30', closedDays: [1] },
  'Montmartre before crowds': { lat: 48.8867, lng: 2.3431, duration: 120, open: '00:00', close: '23:59', closedDays: [] },
  'One museum, properly': { lat: 48.86, lng: 2.3266, duration: 150, open: '09:30', close: '18:00', closedDays: [1], lastEntry: '17:00' },
  'Seine walk to Île Saint-Louis': { lat: 48.8515, lng: 2.356, duration: 120, open: '00:00', close: '23:59', closedDays: [] },
  'Le Marais browsing': { lat: 48.859, lng: 2.362, duration: 120, open: '10:00', close: '20:00', closedDays: [0] },
  'Natural wine bar': { lat: 48.865, lng: 2.37, duration: 90, open: '17:00', close: '00:00', closedDays: [0, 1] },
  'Canal Saint-Martin picnic': { lat: 48.871, lng: 2.365, duration: 120, open: '00:00', close: '23:59', closedDays: [] },
  'Jazz cellar in Saint-Germain': { lat: 48.854, lng: 2.334, duration: 120, open: '20:00', close: '02:00', closedDays: [] },
};

export const DEFAULT_META: VenueMeta = {
  lat: 0,
  lng: 0,
  duration: 90,
  open: '09:00',
  close: '22:00',
  closedDays: [],
};
