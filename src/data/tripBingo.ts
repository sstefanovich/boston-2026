export interface BingoItem {
  id: string;
  label: string;
  emoji: string;
  region: 'boston' | 'harbor' | 'any';
  mapQuery?: string;
  placeId?: string;
}

export const TRIP_BINGO_ITEMS: BingoItem[] = [
  { id: 'wicked', label: 'Said "wicked" unironically', emoji: '🗣️', region: 'any' },
  { id: 'phrase-speak', label: 'Played slang with 🔊 Listen', emoji: '📱', region: 'any' },
  { id: 'rideshare', label: 'Uber or Lyft ride', emoji: '🚗', region: 'any' },
  { id: 'the-t', label: 'Rode the T (subway)', emoji: '🚇', region: 'any' },
  { id: 'dunks', label: 'Dunkin\' coffee run', emoji: '☕', region: 'any' },
  { id: 'ice-cream', label: 'Jimmies on ice cream', emoji: '🍦', region: 'any' },
  { id: 'group-photo', label: 'Group photo at a landmark', emoji: '📸', region: 'any' },
  { id: 'late-dinner', label: 'Dinner after 9 PM', emoji: '🌙', region: 'any' },
  { id: 'cheers', label: 'Cheers with Sam Adams or local beer', emoji: '🍺', region: 'any' },
  { id: 'walked-5mi', label: 'Walked 5+ miles in one day', emoji: '👟', region: 'any' },

  { id: 'chowder', label: 'New England clam chowder', emoji: '🥣', region: 'boston', placeId: 'dine-legal' },
  { id: 'lobster-roll', label: 'Lobster roll', emoji: '🦞', region: 'boston', mapQuery: 'lobster roll Boston' },
  { id: 'cannoli', label: 'North End cannoli', emoji: '🥐', region: 'boston', placeId: 'dine-mike' },
  { id: 'freedom-trail', label: 'Freedom Trail segment', emoji: '🥾', region: 'boston', placeId: 'sight-common' },
  { id: 'faneuil', label: 'Faneuil Hall / Quincy Market', emoji: '🏛️', region: 'boston', placeId: 'sight-faneuil' },
  { id: 'public-garden', label: 'Public Garden or swan boats', emoji: '🦢', region: 'boston', placeId: 'sight-garden' },
  { id: 'beacon-hill', label: 'Beacon Hill / Acorn Street', emoji: '🏘️', region: 'boston', mapQuery: 'Acorn Street Beacon Hill Boston' },
  { id: 'regina-pizza', label: 'Regina pizza slice', emoji: '🍕', region: 'boston', placeId: 'dine-regina' },
  { id: 'fenway', label: 'Fenway Park visit', emoji: '⚾', region: 'boston', placeId: 'sight-fenway' },
  { id: 'harvard', label: 'Harvard Yard stroll', emoji: '🎓', region: 'boston', placeId: 'sight-harvard' },

  { id: 'harborwalk', label: 'Harborwalk stroll', emoji: '🌊', region: 'harbor', mapQuery: 'Boston Harborwalk' },
  { id: 'uss-constitution', label: 'USS Constitution', emoji: '⛵', region: 'harbor', placeId: 'sight-constitution' },
  { id: 'aquarium', label: 'New England Aquarium', emoji: '🐠', region: 'harbor', placeId: 'sight-aquarium' },
  { id: 'tea-party', label: 'Boston Tea Party Museum', emoji: '🫖', region: 'harbor', mapQuery: 'Boston Tea Party Ships and Museum' },
  { id: 'fried-clams', label: 'Fried clams or fish & chips', emoji: '🐟', region: 'harbor', mapQuery: 'fried clams Boston' },
  { id: 'water-taxi', label: 'Harbor ferry or water taxi', emoji: '🚤', region: 'harbor', mapQuery: 'Boston Harbor ferry' },
];
