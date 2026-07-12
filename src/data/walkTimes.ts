import type { Place } from './content';

const PLACE_WALK: Record<string, { minutes?: number; hint?: string }> = {
  'sight-common': { minutes: 18 },
  'sight-garden': { minutes: 8 },
  'sight-faneuil': { minutes: 25 },
  'sight-aquarium': { minutes: 28 },
  'sight-constitution': { hint: '~20 min by T, or rideshare to Charlestown Navy Yard' },
  'sight-fenway': { minutes: 12 },
  'sight-harvard': { hint: '~25 min by Red Line from Arlington' },
  'sight-mit': { hint: '~30 min by Red Line to Kendall/MIT' },
  'dine-union': { minutes: 22 },
  'dine-regina': { minutes: 22 },
  'dine-mike': { minutes: 22 },
  'dine-legal': { minutes: 26 },
  'dine-atlantic': { minutes: 6 },
  'dine-piattini': { minutes: 2 },
  'dine-krasi': { minutes: 6 },
  'dine-la-voile': { hint: 'Same building as Newbury Guest House' },
  'station-south': { minutes: 25 },
  'station-logan': { hint: '~25–35 min by rideshare or SL1 + walk' },
  'station-back-bay': { minutes: 12 },
  'meet-north-end-food': { minutes: 28 },
};

export function getWalkHintForPlace(place: Place): string | null {
  if (place.kind === 'hotel') return null;
  const entry = PLACE_WALK[place.id];
  if (!entry) return null;
  if (entry.hint) return entry.hint;
  if (entry.minutes == null) return null;
  return `~${entry.minutes} min walk from Newbury Guest House`;
}
