import type { Place } from '../data/content';

/** Uber mobile web — opens app when installed */
export function uberDropoffUrl(address: string): string {
  const params = new URLSearchParams();
  params.set('dropoff[formatted_address]', address);
  return `https://m.uber.com/looking?${params.toString()}`;
}

/** Bolt ride — lat/lng preferred; address fallback */
export function boltDropoffUrl(place: Place): string {
  if (place.lat != null && place.lng != null) {
    return `bolt://ride?destination=${place.lat},${place.lng}`;
  }
  return `https://ride.bolt.eu/?address=${encodeURIComponent(place.address)}`;
}
