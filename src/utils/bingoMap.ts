import { HOTELS, MEETING_POINTS, RESTAURANTS, SIGHTS } from '../data/content';
import type { BingoItem } from '../data/tripBingo';
import { mapsPlaceUrl, mapsSearchForPlace, mapsSearchUrl } from './links';

const PLACES_BY_ID = new Map(
  [...HOTELS, ...MEETING_POINTS, ...RESTAURANTS, ...SIGHTS].map((p) => [p.id, p])
);

export function bingoMapUrl(item: BingoItem): string | null {
  if (item.placeId) {
    const place = PLACES_BY_ID.get(item.placeId);
    if (place) {
      if (place.lat != null && place.lng != null) {
        return mapsPlaceUrl(place.lat, place.lng, place.name);
      }
      return mapsSearchForPlace(place.name, place.address);
    }
  }
  if (item.mapQuery) {
    return mapsSearchUrl(item.mapQuery);
  }
  return null;
}

export function bingoHasMap(item: BingoItem): boolean {
  return Boolean(item.placeId || item.mapQuery);
}
