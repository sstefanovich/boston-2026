/** Calendar stamps are Europe/Paris local (CEST in June). */

const PARIS_OFFSET_MS = 2 * 60 * 60 * 1000;

/** UTC ms for a Paris wall-clock stamp YYYYMMDDHHMMSS */
export function parisStampToUtcMs(stamp: string): number {
  const y = Number.parseInt(stamp.slice(0, 4), 10);
  const mo = Number.parseInt(stamp.slice(4, 6), 10) - 1;
  const d = Number.parseInt(stamp.slice(6, 8), 10);
  const h = Number.parseInt(stamp.slice(8, 10), 10);
  const mi = Number.parseInt(stamp.slice(10, 12), 10);
  return Date.UTC(y, mo, d, h, mi) - PARIS_OFFSET_MS;
}

export function minutesBetweenUtc(fromMs: number, toMs: number): number {
  return Math.round((toMs - fromMs) / 60_000);
}

export function formatCountdown(minutes: number): string {
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function formatClockInZone(timeZone: string, now = new Date()): string {
  return now.toLocaleTimeString(undefined, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
