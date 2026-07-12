export type CityTheme = 'boston' | 'northend' | 'harbor' | 'cambridge' | 'sports' | 'travel' | 'food' | 'fallout';

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  theme: CityTheme;
  kind: 'hotel' | 'meeting' | 'station' | 'restaurant' | 'sight';
  notes?: string;
  phone?: string;
  website?: string;
}

export interface TripEvent {
  id: string;
  title: string;
  dateLabel: string;
  dayId: string;
  start: string;
  end: string;
  location?: string;
  address?: string;
  details?: string;
  theme: CityTheme;
  mapQuery?: string;
  website?: string;
}

export interface DontMissEntry {
  text: string;
  address?: string;
  mapQuery?: string;
}

export interface TimelineDay {
  id: string;
  date: string;
  weekday: string;
  where: string;
  highlights: string;
  theme: CityTheme;
  image: string;
  freeTime?: string;
  dontMiss: DontMissEntry[];
  rain?: string;
  rainMapQuery?: string;
}

export function dm(text: string, mapQuery?: string, address?: string): DontMissEntry {
  return {
    text,
    address,
    mapQuery: mapQuery ?? address,
  };
}

export interface Phrase {
  foreign: string;
  sounds: string;
  english: string;
  speakLang?: 'en-US';
}

export interface TravelApp {
  name: string;
  why: string;
  packageId?: string;
  webUrl?: string;
  owners?: string;
}

export const APP_TITLE = 'Boston 2026';
export const APP_SUBTITLE = 'Aug 8 – 12 · Downtown · North End · Harbor · Cambridge';

/** Bundled hero photos in public/images — Boston-themed, works offline */
export const CITY_IMAGES: Record<CityTheme, string> = {
  boston: '/images/boston.jpg',
  northend: '/images/northend.jpg',
  harbor: '/images/harbor.jpg',
  cambridge: '/images/cambridge.jpg',
  sports: '/images/sports.jpg',
  travel: '/images/travel.jpg',
  food: '/images/food.jpg',
  fallout: '/images/boston.jpg',
};

/** Family / travel group — edit names here; also editable in Expenses */
export const TRIP_MEMBERS = ['Steve', 'Sue', 'Kristen'] as const;

export type TripMemberName = (typeof TRIP_MEMBERS)[number];

export const EXPENSE_CATEGORIES = [
  'Meals',
  'Hotel',
  'Transport',
  'Activities',
  'Groceries',
  'Other',
] as const;

export const NAV_SECTIONS: NavSection[] = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'itinerary', label: 'Itinerary', icon: 'days', path: '/itinerary' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', path: '/calendar' },
  { id: 'weather', label: 'Weather', icon: 'sun', path: '/weather' },
  { id: 'places', label: 'Maps', icon: 'maps', path: '/places' },
  { id: 'dontmiss', label: "Don't Miss", icon: 'star', path: '/dont-miss' },
  { id: 'bingo', label: 'Trip Bingo', icon: 'bingo', path: '/bingo' },
  { id: 'expenses', label: 'Expenses', icon: 'wallet', path: '/expenses' },
  { id: 'journal', label: 'Journal', icon: 'journal', path: '/journal' },
  { id: 'fallout', label: 'Fallout Boston', icon: 'fallout', path: '/fallout' },
  { id: 'setup', label: 'Before You Go', icon: 'setup', path: '/setup' },
  { id: 'quick', label: 'Quick Ref', icon: 'ticket', path: '/quick-ref' },
  { id: 'emergency', label: 'Emergency', icon: 'emergency', path: '/emergency' },
  { id: 'more', label: 'More', icon: 'book', path: '/more' },
];

export const HOTELS: Place[] = [
  {
    id: 'hotel-boston',
    name: 'Newbury Guest House',
    address: '261 Newbury St, Boston, MA 02116, USA',
    city: 'Boston',
    lat: 42.3493,
    lng: -71.0827,
    theme: 'boston',
    kind: 'hotel',
    notes: 'Back Bay · check-in 3 PM · check-out noon',
    phone: '+1 617-670-6000',
    website: 'https://www.newburyguesthouse.com/',
  },
];

export const MEETING_POINTS: Place[] = [
  {
    id: 'station-logan',
    name: 'Boston Logan International Airport',
    address: '1 Harborside Dr, Boston, MA 02128',
    city: 'Boston',
    lat: 42.3656,
    lng: -71.0096,
    theme: 'travel',
    kind: 'station',
    notes: 'Silver Line SL1 to South Station · ~20–30 min to downtown',
    website: 'https://www.massport.com/logan-airport/',
  },
  {
    id: 'station-south',
    name: 'South Station',
    address: '700 Atlantic Ave, Boston, MA 02110',
    city: 'Boston',
    lat: 42.3523,
    lng: -71.0552,
    theme: 'travel',
    kind: 'station',
    notes: 'Amtrak · MBTA Red Line · bus terminal',
    website: 'https://www.amtrak.com/stations/bos',
  },
  {
    id: 'station-back-bay',
    name: 'Back Bay Station',
    address: '145 Dartmouth St, Boston, MA 02116',
    city: 'Boston',
    lat: 42.3473,
    lng: -71.0755,
    theme: 'travel',
    kind: 'station',
    notes: 'Amtrak & commuter rail',
    website: 'https://www.amtrak.com/stations/bby',
  },
  {
    id: 'meet-north-end-food',
    name: 'North End Food Tour — meetup',
    address: '156 Blackstone St, Boston, MA 02109',
    city: 'Boston',
    lat: 42.3618,
    lng: -71.0568,
    theme: 'northend',
    kind: 'meeting',
    notes:
      'Booking YPWZK2GG · Mon 10 Aug 12:00 PM · 6 travellers (Susan Stefanovich) · Meet outside RMV / Boston Public Market entrance · arrive 5–10 min early · Glass-and-metal awning by Surface Rd & Hanover St bus stop · MassDOT sign',
    website: 'https://www.urbanadventures.com/en/boston/boston-north-end-food-tour',
  },
];

export const RESTAURANTS: Place[] = [
  {
    id: 'dine-union',
    name: 'Union Oyster House',
    address: '41 Union St, Boston, MA 02108',
    city: 'Boston',
    lat: 42.3612,
    lng: -71.0567,
    theme: 'food',
    kind: 'restaurant',
    notes: 'America\'s oldest restaurant · chowder & oysters',
    website: 'https://www.unionoysterhouse.com/',
  },
  {
    id: 'dine-regina',
    name: 'Regina Pizzeria (North End)',
    address: '11½ Thacher St, Boston, MA 02113',
    city: 'Boston',
    lat: 42.3651,
    lng: -71.055,
    theme: 'northend',
    kind: 'restaurant',
    notes: 'Cash preferred · expect a line',
    website: 'https://www.pizzeriaregina.com/',
  },
  {
    id: 'dine-mike',
    name: 'Mike\'s Pastry',
    address: '300 Hanover St, Boston, MA 02113',
    city: 'Boston',
    lat: 42.3658,
    lng: -71.0545,
    theme: 'northend',
    kind: 'restaurant',
    notes: 'Cannoli classic · Hanover St',
    website: 'https://www.mikespastry.com/',
  },
  {
    id: 'dine-legal',
    name: 'Legal Sea Foods (Harbor)',
    address: '255 State St, Boston, MA 02109',
    city: 'Boston',
    lat: 42.3592,
    lng: -71.0515,
    theme: 'harbor',
    kind: 'restaurant',
    notes: 'Clam chowder & lobster roll',
    website: 'https://www.legalseafoods.com/',
  },
  {
    id: 'dine-atlantic',
    name: 'Atlantic Fish',
    address: '761 Boylston St, Boston, MA 02116',
    city: 'Boston',
    lat: 42.3485,
    lng: -71.082,
    theme: 'food',
    kind: 'restaurant',
    notes: 'Sat 8 Aug · reservation 7–9 PM Boston (6–8 PM CDT)',
    website: 'https://www.atlanticfish.com/',
  },
  {
    id: 'dine-piattini',
    name: 'Piattini',
    address: '226 Newbury St, Boston, MA 02116',
    city: 'Boston',
    lat: 42.3498,
    lng: -71.0815,
    theme: 'food',
    kind: 'restaurant',
    notes: 'Sun 9 Aug · reservation 7–9 PM Boston (6–8 PM CDT)',
    website: 'https://www.piattinirestaurant.com/',
  },
  {
    id: 'dine-krasi',
    name: 'Krasi',
    address: '48 Gloucester St, Boston, MA 02115',
    city: 'Boston',
    lat: 42.3489,
    lng: -71.0845,
    theme: 'food',
    kind: 'restaurant',
    notes: 'Mon 10 Aug · reservation 6–8 PM · Greek meze & wine bar',
    phone: '+1 617-536-0230',
    website: 'https://www.krasiboston.com/',
  },
  {
    id: 'dine-la-voile',
    name: 'La Voile',
    address: '261 Newbury St, Boston, MA 02116',
    city: 'Boston',
    lat: 42.3493,
    lng: -71.0827,
    theme: 'food',
    kind: 'restaurant',
    notes: 'Tue 11 Aug · reservation 5:30–7:30 PM · French brasserie · same building as guest house',
    phone: '+1 617-587-4200',
    website: 'https://www.lavoilerestaurants.com/la-voile-newbury/',
  },
];

export const SIGHTS: Place[] = [
  {
    id: 'sight-common',
    name: 'Boston Common',
    address: '139 Tremont St, Boston, MA 02111',
    city: 'Boston',
    lat: 42.3551,
    lng: -71.0657,
    theme: 'boston',
    kind: 'sight',
    notes: 'Start of the Freedom Trail',
    website: 'https://www.boston.gov/parks/boston-common',
  },
  {
    id: 'sight-garden',
    name: 'Public Garden & Swan Boats',
    address: '4 Charles St, Boston, MA 02116',
    city: 'Boston',
    lat: 42.3541,
    lng: -71.0707,
    theme: 'boston',
    kind: 'sight',
    website: 'https://www.boston.gov/parks/public-garden',
  },
  {
    id: 'sight-faneuil',
    name: 'Faneuil Hall & Quincy Market',
    address: '4 S Market St, Boston, MA 02109',
    city: 'Boston',
    lat: 42.3602,
    lng: -71.0549,
    theme: 'boston',
    kind: 'sight',
    website: 'https://www.nps.gov/bost/planyourvisit/faneuil-hall.htm',
  },
  {
    id: 'sight-aquarium',
    name: 'New England Aquarium',
    address: '1 Central Wharf, Boston, MA 02110',
    city: 'Boston',
    lat: 42.3591,
    lng: -71.0498,
    theme: 'harbor',
    kind: 'sight',
    website: 'https://www.neaq.org/',
  },
  {
    id: 'sight-constitution',
    name: 'USS Constitution & Museum',
    address: 'Building 22, Charlestown Navy Yard, Boston, MA 02129',
    city: 'Boston',
    lat: 42.3725,
    lng: -71.0566,
    theme: 'harbor',
    kind: 'sight',
    notes: 'Free tours · arrive early',
    website: 'https://ussconstitutionmuseum.org/',
  },
  {
    id: 'sight-fenway',
    name: 'Fenway Park',
    address: '4 Jersey St, Boston, MA 02215',
    city: 'Boston',
    lat: 42.3467,
    lng: -71.0972,
    theme: 'sports',
    kind: 'sight',
    notes: 'Tour or game if in season',
    website: 'https://www.mlb.com/redsox/ballpark',
  },
  {
    id: 'sight-harvard',
    name: 'Harvard Yard',
    address: 'Cambridge, MA 02138',
    city: 'Cambridge',
    lat: 42.3744,
    lng: -71.1182,
    theme: 'cambridge',
    kind: 'sight',
    website: 'https://www.harvard.edu/visit/',
  },
  {
    id: 'sight-mit',
    name: 'MIT Stata Center area',
    address: '32 Vassar St, Cambridge, MA 02139',
    city: 'Cambridge',
    lat: 42.3616,
    lng: -71.0906,
    theme: 'cambridge',
    kind: 'sight',
    website: 'https://www.mit.edu/visit/',
  },
];

export const TIMELINE: TimelineDay[] = [
  {
    id: 'aug8',
    date: 'Sat 8 Aug',
    weekday: 'Saturday',
    where: 'Boston — arrive',
    highlights: 'UA1117 lands 12:47 PM · check-in 3 PM · Atlantic Fish 7 PM',
    theme: 'travel',
    image: CITY_IMAGES.travel,
    freeTime: 'After landing ~12:47 PM — Logan to Back Bay (~25–35 min) · hotel check-in 3 PM',
    dontMiss: [
      dm('★ UA1117 lands at Logan 12:47 PM', 'Boston Logan Airport', '1 Harborside Dr, Boston, MA 02128'),
      dm('★ Dinner — Atlantic Fish 7 PM', 'Atlantic Fish 761 Boylston St Boston', '761 Boylston St, Boston, MA 02116'),
      dm('Walk Boston Common at dusk', 'Boston Common', '139 Tremont St, Boston, MA 02111'),
      dm('Grab a cannoli on Hanover St', 'Mike\'s Pastry Boston', '300 Hanover St, Boston, MA 02113'),
    ],
    rain: 'Museum of Fine Arts or New England Aquarium',
    rainMapQuery: 'Museum of Fine Arts Boston',
  },
  {
    id: 'aug9',
    date: 'Sun 9 Aug',
    weekday: 'Sunday',
    where: 'Boston',
    highlights: 'Freedom Trail · Faneuil Hall · Piattini 7 PM',
    theme: 'boston',
    image: CITY_IMAGES.boston,
    freeTime: '~Until 7 PM dinner',
    dontMiss: [
      dm('★ Dinner — Piattini 7 PM', 'Piattini 226 Newbury St Boston', '226 Newbury St, Boston, MA 02116'),
      dm('★ Freedom Trail (2.5 mi)', 'Freedom Trail Boston', 'Boston Common, 139 Tremont St, Boston, MA'),
      dm('★ Public Garden & swan boats', 'Public Garden Boston', '4 Charles St, Boston, MA 02116'),
      dm('Quincy Market lunch', 'Quincy Market Boston', '4 S Market St, Boston, MA 02109'),
      dm('Beacon Hill cobblestones', 'Acorn Street Beacon Hill Boston'),
    ],
    rain: 'Boston Tea Party Ships & Museum',
    rainMapQuery: 'Boston Tea Party Ships and Museum',
  },
  {
    id: 'aug10',
    date: 'Mon 10 Aug',
    weekday: 'Monday',
    where: 'North End · harbor · dinner',
    highlights: 'North End Food Tour 12 PM · waterfront · Krasi dinner 6 PM',
    theme: 'northend',
    image: CITY_IMAGES.northend,
    freeTime: 'Before noon meetup · after tour ~3 PM · dinner 6 PM',
    dontMiss: [
      dm(
        '★ North End Food Experience Tour 12 PM',
        'Boston RMV Service Center 156 Blackstone St',
        '156 Blackstone St, Boston, MA 02109'
      ),
      dm('Arrive 5–10 min early — show booking YPWZK2GG', 'Boston Public Market Blackstone St'),
      dm('★ Harborwalk stroll', 'Boston Harborwalk'),
      dm('USS Constitution', 'USS Constitution Museum', 'Charlestown Navy Yard, Boston, MA'),
      dm('New England Aquarium', 'New England Aquarium', '1 Central Wharf, Boston, MA 02110'),
      dm(
        '★ Dinner — Krasi 6–8 PM',
        'Krasi 48 Gloucester St Boston',
        '48 Gloucester St, Boston, MA 02115'
      ),
    ],
    rain: 'Institute of Contemporary Art',
    rainMapQuery: 'Institute of Contemporary Art Boston',
  },
  {
    id: 'aug11',
    date: 'Tue 11 Aug',
    weekday: 'Tuesday',
    where: 'Boston / Cambridge · dinner',
    highlights: 'Fenway or Cambridge day · La Voile dinner 5:30 PM',
    theme: 'cambridge',
    image: CITY_IMAGES.cambridge,
    freeTime: 'Day free · dinner 5:30 PM at hotel building',
    dontMiss: [
      dm('Harvard Yard walk', 'Harvard Yard Cambridge', 'Cambridge, MA 02138'),
      dm('MIT campus loop', 'MIT Stata Center Cambridge'),
      dm('Fenway Park tour or game', 'Fenway Park Boston', '4 Jersey St, Boston, MA 02215'),
      dm('Red Sox gear on Lansdowne', 'Lansdowne Street Boston'),
      dm(
        '★ Dinner — La Voile 5:30–7:30 PM',
        'La Voile 261 Newbury St Boston',
        '261 Newbury St, Boston, MA 02116'
      ),
    ],
    rain: 'Museum of Science',
    rainMapQuery: 'Museum of Science Boston',
  },
  {
    id: 'aug12',
    date: 'Wed 12 Aug',
    weekday: 'Wednesday',
    where: 'Depart Boston',
    highlights: 'Check out noon · UA1732 departs 12:20 PM',
    theme: 'travel',
    image: CITY_IMAGES.travel,
    freeTime: 'Leave for Logan ~10:30 AM for 12:20 PM departure · check out by noon',
    dontMiss: [
      dm('★ UA1732 departs Logan 12:20 PM', 'Boston Logan Airport', '1 Harborside Dr, Boston, MA 02128'),
      dm('Leave for Logan ~10:30 AM', 'Boston Logan Airport United departures'),
      dm('Check out by 12 PM', 'Newbury Guest House', '261 Newbury St, Boston, MA 02116'),
      dm('Leave extra time for Logan security', 'Boston Logan Airport', '1 Harborside Dr, Boston, MA 02128'),
      dm('Last coffee at Thinking Cup or Tatte', 'Thinking Cup Boston'),
      dm('Grab a lobster roll for the road', 'Pauli\'s North End Boston'),
    ],
  },
];

/** Calendar times are Boston (Eastern) local — YYYYMMDDHHMMSS */
export const CALENDAR_EVENTS: TripEvent[] = [
  {
    id: 'e-ua1117',
    title: 'UA1117 — ORD → BOS',
    dateLabel: 'Sat 8 Aug',
    dayId: 'aug8',
    start: '20260808124700',
    end: '20260808140000',
    location: 'Boston Logan (BOS)',
    address: '1 Harborside Dr, Boston, MA 02128',
    details: 'United Economy (L) · departed Chicago ORD 9:20 AM Central',
    theme: 'travel',
    mapQuery: 'Boston Logan Airport United arrivals',
    website: 'https://www.united.com/',
  },
  {
    id: 'e-atlantic',
    title: 'Dinner — Atlantic Fish',
    dateLabel: 'Sat 8 Aug',
    dayId: 'aug8',
    start: '20260808190000',
    end: '20260808210000',
    location: 'Atlantic Fish',
    address: '761 Boylston St, Boston, MA 02116',
    details: 'Reservation 6–8 PM CDT · 7–9 PM Boston',
    theme: 'food',
    mapQuery: 'Atlantic Fish 761 Boylston St Boston',
    website: 'https://www.atlanticfish.com/',
  },
  {
    id: 'e-piattini',
    title: 'Dinner — Piattini',
    dateLabel: 'Sun 9 Aug',
    dayId: 'aug9',
    start: '20260809190000',
    end: '20260809210000',
    location: 'Piattini',
    address: '226 Newbury St, Boston, MA 02116',
    details: 'Reservation 6–8 PM CDT · 7–9 PM Boston',
    theme: 'food',
    mapQuery: 'Piattini 226 Newbury St Boston',
    website: 'https://www.piattinirestaurant.com/',
  },
  {
    id: 'e-north-end-food',
    title: 'North End Food Experience Tour',
    dateLabel: 'Mon 10 Aug',
    dayId: 'aug10',
    start: '20260810120000',
    end: '20260810150000',
    location: 'Boston RMV Service Center',
    address: '156 Blackstone St, Boston, MA 02109',
    details:
      'Booking YPWZK2GG · Traveller Susan Stefanovich · 6 travellers · Meet outside RMV / Boston Public Market entrance · arrive 5–10 min early · show confirmation to guide',
    theme: 'northend',
    mapQuery: 'Boston RMV Service Center 156 Blackstone St',
    website: 'https://www.urbanadventures.com/en/boston/boston-north-end-food-tour',
  },
  {
    id: 'e-krasi',
    title: 'Dinner — Krasi',
    dateLabel: 'Mon 10 Aug',
    dayId: 'aug10',
    start: '20260810180000',
    end: '20260810200000',
    location: 'Krasi',
    address: '48 Gloucester St, Boston, MA 02115',
    details: 'Reservation 6–8 PM · Greek meze & wine bar · Back Bay',
    theme: 'food',
    mapQuery: 'Krasi 48 Gloucester St Boston',
    website: 'https://www.krasiboston.com/',
  },
  {
    id: 'e-la-voile',
    title: 'Dinner — La Voile',
    dateLabel: 'Tue 11 Aug',
    dayId: 'aug11',
    start: '20260811173000',
    end: '20260811193000',
    location: 'La Voile',
    address: '261 Newbury St, Boston, MA 02116',
    details: 'Reservation 5:30–7:30 PM · French brasserie · same building as Newbury Guest House',
    theme: 'food',
    mapQuery: 'La Voile 261 Newbury St Boston',
    website: 'https://www.lavoilerestaurants.com/la-voile-newbury/',
  },
  {
    id: 'e-ua1732',
    title: 'UA1732 — BOS → ORD',
    dateLabel: 'Wed 12 Aug',
    dayId: 'aug12',
    start: '20260812103000',
    end: '20260812122000',
    location: 'Boston Logan (BOS)',
    address: '1 Harborside Dr, Boston, MA 02128',
    details: 'United Economy (K) · departs 12:20 PM · arrives ORD 2:07 PM Central',
    theme: 'travel',
    mapQuery: 'Boston Logan Airport United departures',
    website: 'https://www.united.com/',
  },
];

export const QUICK_REF_SLANG = [
  { label: 'Wicked', slang: 'WICK-ed', meaning: 'Very (wicked good = really good)' },
  { label: 'Bang a U-ey', slang: 'bang a U-ay', meaning: 'Make a U-turn' },
  { label: 'The T', slang: 'the tee', meaning: 'MBTA subway' },
  { label: 'Packie', slang: 'PAK-ee', meaning: 'Liquor store' },
  { label: 'Bubbler', slang: 'BUB-ler', meaning: 'Drinking fountain' },
  { label: 'Jimmies', slang: 'JIM-eez', meaning: 'Chocolate sprinkles' },
  { label: 'Emergency', slang: '911', meaning: 'US emergency number' },
];

export const BOSTON_SLANG: Phrase[] = [
  { foreign: 'Wicked', sounds: 'WICK-ed', english: 'Very — "wicked good pizza"', speakLang: 'en-US' },
  { foreign: 'Wicked pissah', sounds: 'WICK-ed PISS-ah', english: 'Awesome / really great', speakLang: 'en-US' },
  { foreign: 'Bang a U-ey', sounds: 'bang a U-ay', english: 'Make a U-turn', speakLang: 'en-US' },
  { foreign: 'The T', sounds: 'the tee', english: 'The MBTA subway', speakLang: 'en-US' },
  { foreign: 'Packie', sounds: 'PAK-ee', english: 'Liquor store', speakLang: 'en-US' },
  { foreign: 'Bubbler', sounds: 'BUB-ler', english: 'Drinking fountain', speakLang: 'en-US' },
  { foreign: 'Jimmies', sounds: 'JIM-eez', english: 'Chocolate sprinkles on ice cream', speakLang: 'en-US' },
  { foreign: 'Down cellah', sounds: 'down SELL-ah', english: 'Down in the basement', speakLang: 'en-US' },
  { foreign: 'Clickah', sounds: 'CLICK-ah', english: 'Remote control', speakLang: 'en-US' },
  { foreign: 'Dunks', sounds: 'dunks', english: 'Dunkin\' (coffee run)', speakLang: 'en-US' },
  { foreign: 'No suh!', sounds: 'no suh', english: 'No way! / seriously?', speakLang: 'en-US' },
  { foreign: 'So don\'t I', sounds: 'so dont I', english: 'Me too / same here', speakLang: 'en-US' },
];

export const BOSTON_DISHES: Phrase[] = [
  { foreign: 'New England clam chowder', sounds: 'clam CHOW-dah', english: 'Creamy white clam soup — the classic', speakLang: 'en-US' },
  { foreign: 'Lobster roll', sounds: 'LOB-ster roll', english: 'Cold or buttered lobster on a split-top bun', speakLang: 'en-US' },
  { foreign: 'Fried clams', sounds: 'fried clams', english: 'Whole-belly clams, often with tartar sauce', speakLang: 'en-US' },
  { foreign: 'Boston cream pie', sounds: 'BOS-ton cream pie', english: 'Cake with custard & chocolate glaze (not a pie!)', speakLang: 'en-US' },
  { foreign: 'Cannoli', sounds: 'can-NO-lee', english: 'North End pastry — crisp shell, sweet ricotta', speakLang: 'en-US' },
  { foreign: 'North End Italian', sounds: 'north end', english: 'Red-sauce pasta, arancini, espresso', speakLang: 'en-US' },
  { foreign: 'Scrod', sounds: 'skrawd', english: 'Catch-of-the-day white fish, often baked', speakLang: 'en-US' },
  { foreign: 'Fenway frank', sounds: 'FEN-way frank', english: 'Ballpark hot dog at Fenway', speakLang: 'en-US' },
  { foreign: 'Sam Adams', sounds: 'sam AY-dams', english: 'Boston-born craft lager', speakLang: 'en-US' },
  { foreign: 'Fluffernutter', sounds: 'FLUFF-er-nut-ter', english: 'Marshmallow fluff & peanut butter sandwich', speakLang: 'en-US' },
];

export const TRAVEL_APPS: TravelApp[] = [
  { name: 'Google Maps', why: 'Offline map: Boston, Cambridge, Logan', owners: 'Everyone' },
  { name: 'MBTA mTicket', why: 'Commuter rail & ferry tickets', packageId: 'com.mbta.mobileapp', owners: 'Everyone' },
  { name: 'Uber / Lyft', why: 'Rides — Logan ↔ downtown', owners: 'Anyone' },
  { name: 'Bluebikes', why: 'Bike share stations citywide', webUrl: 'https://www.bluebikes.com/', owners: 'Optional' },
  { name: 'United', why: 'UA1117 & UA1732 — mobile boarding pass & flight status', packageId: 'com.united.mobile.android', owners: 'Flight lead' },
  { name: 'OpenTable / Resy', why: 'North End & hot spots book up', owners: 'Dinner lead' },
  { name: 'WhatsApp / iMessage', why: 'Group chat on the trip', owners: 'Everyone' },
];

export const EMERGENCY = [
  { label: 'Emergency (US)', value: '911', tel: '911' },
  { label: 'Boston Police (non-emergency)', value: '617-343-4500', tel: '+16173434500' },
  { label: 'Mass General Hospital', value: '617-726-2000', tel: '+16177262000' },
  { label: 'Poison Control', value: '1-800-222-1222', tel: '+18002221222' },
];

export const ICON_CHECKLIST = {
  boston: ['Freedom Trail', 'Boston Common & Public Garden', 'Faneuil Hall / Quincy Market', 'Beacon Hill'],
  harbor: ['Harborwalk', 'USS Constitution', 'New England Aquarium', 'Tea Party Museum'],
  cambridge: ['Harvard Yard', 'MIT campus', 'Charles River walk'],
  sports: ['Fenway Park tour or game', 'Red Sox gear'],
};

export const USEFUL_LINKS = [
  { label: 'MBTA Trip Planner', url: 'https://www.mbta.com/trip-planner' },
  { label: 'Logan Airport (Massport)', url: 'https://www.massport.com/logan-airport/' },
  { label: 'Freedom Trail', url: 'https://www.thefreedomtrail.org/' },
  { label: 'Boston Visitor Guide', url: 'https://www.bostonusa.com/' },
  { label: 'Bluebikes', url: 'https://www.bluebikes.com/' },
  { label: 'Fenway Park tours', url: 'https://www.mlb.com/redsox/ballpark/tours' },
];
