import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

function isAppDeepLink(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('http');
}

/** Open external URLs — Capacitor Browser on device, window.open in dev */
export async function openUrl(url: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    // bolt:// etc. must hit the OS handler, not in-app Browser
    if (isAppDeepLink(url)) {
      window.location.href = url;
      return;
    }
    await Browser.open({ url });
    return;
  }
  if (isAppDeepLink(url)) {
    window.location.href = url;
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapsDirectionsUrl(destination: string, lat?: number, lng?: number): string {
  const dest =
    lat != null && lng != null ? `${lat},${lng}` : destination;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

/** Pin on map — prefer lat/lng; optional label improves search fallback */
export function mapsPlaceUrl(lat: number, lng: number, label?: string): string {
  const query = label ? `${label}@${lat},${lng}` : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapsSearchForPlace(name: string, address: string): string {
  return mapsSearchUrl(`${name}, ${address}`);
}

/** Google Calendar — times in Europe/Paris local (CEST), format YYYYMMDDTHHMMSS */
export function calendarEventUrl(opts: {
  title: string;
  start: string;
  end: string;
  location?: string;
  details?: string;
}): string {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${opts.start}/${opts.end}`,
  });
  if (opts.location) p.set('location', opts.location);
  if (opts.details) p.set('details', opts.details);
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function telUrl(number: string): string {
  const clean = number.replace(/[^\d+]/g, '');
  return `tel:${clean}`;
}

export function playStoreUrl(packageId: string): string {
  return `https://play.google.com/store/apps/details?id=${packageId}`;
}
