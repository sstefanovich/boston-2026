import {
  CALENDAR_EVENTS,
  HOTELS,
  TIMELINE,
  type Place,
  type TimelineDay,
  type TripEvent,
} from '../data/content';

export const TRIP_YEAR = 2026;
const TRIP_MONTH = 7; // August (0-indexed)
const TRIP_START_DAY = 8;
const TRIP_END_DAY = 12;

export type TripPhase = 'before' | 'during' | 'after';

export interface TodaySummary {
  phase: TripPhase;
  date: Date;
  day: TimelineDay | null;
  events: TripEvent[];
  hotel: Place | null;
  daysUntil?: number;
}

function dayIdForDate(date: Date): string {
  return `aug${date.getDate()}`;
}

function timelineDayForDate(date: Date): TimelineDay | null {
  if (date.getFullYear() !== TRIP_YEAR || date.getMonth() !== TRIP_MONTH) return null;
  const dayNum = date.getDate();
  if (dayNum < TRIP_START_DAY || dayNum > TRIP_END_DAY) return null;
  return TIMELINE.find((d) => d.id === dayIdForDate(date)) ?? null;
}

function hotelForDate(date: Date): Place | null {
  if (date.getFullYear() !== TRIP_YEAR || date.getMonth() !== TRIP_MONTH) return null;
  const d = date.getDate();
  if (d >= TRIP_START_DAY && d <= TRIP_END_DAY) {
    return HOTELS.find((h) => h.id === 'hotel-boston') ?? null;
  }
  return null;
}

export function getCurrentTripDayId(now = new Date()): string | null {
  const summary = getTodaySummary(now);
  return summary.phase === 'during' ? summary.day?.id ?? null : null;
}

export interface TripCountdown {
  days: number;
  hours: number;
  minutes: number;
}

export function getTripCountdown(now = new Date()): TripCountdown | null {
  const tripStart = new Date(TRIP_YEAR, TRIP_MONTH, TRIP_START_DAY);
  const ms = tripStart.getTime() - now.getTime();
  if (ms <= 0) return null;

  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

export function getHomeWeatherDayId(now = new Date()): string {
  const summary = getTodaySummary(now);
  if (summary.phase === 'during' && summary.day) return summary.day.id;
  if (summary.phase === 'before') return TIMELINE[0]?.id ?? 'aug8';
  return TIMELINE[TIMELINE.length - 1]?.id ?? 'aug12';
}

export function getTodaySummary(now = new Date()): TodaySummary {
  const tripStart = new Date(TRIP_YEAR, TRIP_MONTH, TRIP_START_DAY);
  const tripEnd = new Date(TRIP_YEAR, TRIP_MONTH, TRIP_END_DAY, 23, 59, 59);

  if (now < tripStart) {
    const daysUntil = Math.ceil((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      phase: 'before',
      date: now,
      day: TIMELINE[0],
      events: [],
      hotel: null,
      daysUntil,
    };
  }

  if (now > tripEnd) {
    return {
      phase: 'after',
      date: now,
      day: TIMELINE[TIMELINE.length - 1],
      events: [],
      hotel: null,
    };
  }

  const day = timelineDayForDate(now);
  const dayId = day?.id;
  const events = dayId ? CALENDAR_EVENTS.filter((e) => e.dayId === dayId) : [];

  return {
    phase: 'during',
    date: now,
    day,
    events,
    hotel: hotelForDate(now),
  };
}
