import { CALENDAR_EVENTS, type TripEvent } from '../data/content';
import { formatEventTimeRange } from './eventTime';
import { formatCountdown, minutesBetweenUtc, parisStampToUtcMs } from './parisTime';
import { getTodaySummary } from './tripToday';

export type NextUpKind = 'upcoming' | 'now' | 'done';

export interface NextUpInfo {
  kind: NextUpKind;
  event: TripEvent;
  minutesUntilStart: number;
  minutesUntilEnd: number;
  timeLabel: string;
  countdownLabel: string;
}

export function getNextUp(now = new Date()): NextUpInfo | null {
  const summary = getTodaySummary(now);
  if (summary.phase !== 'during' || !summary.day) return null;

  const nowMs = now.getTime();
  const todayEvents = CALENDAR_EVENTS.filter((e) => e.dayId === summary.day!.id).sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  if (todayEvents.length === 0) return null;

  for (const event of todayEvents) {
    const startMs = parisStampToUtcMs(event.start);
    const endMs = parisStampToUtcMs(event.end);
    const timeLabel = formatEventTimeRange(event.start, event.end);

    if (nowMs >= startMs && nowMs < endMs) {
      const minutesUntilEnd = minutesBetweenUtc(nowMs, endMs);
      return {
        kind: 'now',
        event,
        minutesUntilStart: 0,
        minutesUntilEnd,
        timeLabel,
        countdownLabel: minutesUntilEnd <= 0 ? 'ending' : `ends in ${formatCountdown(minutesUntilEnd)}`,
      };
    }

    if (nowMs < startMs) {
      const minutesUntilStart = minutesBetweenUtc(nowMs, startMs);
      return {
        kind: 'upcoming',
        event,
        minutesUntilStart,
        minutesUntilEnd: minutesBetweenUtc(nowMs, endMs),
        timeLabel,
        countdownLabel:
          minutesUntilStart <= 0 ? 'starting' : `in ${formatCountdown(minutesUntilStart)}`,
      };
    }
  }

  const last = todayEvents[todayEvents.length - 1];
  return {
    kind: 'done',
    event: last,
    minutesUntilStart: 0,
    minutesUntilEnd: 0,
    timeLabel: formatEventTimeRange(last.start, last.end),
    countdownLabel: 'no more events today',
  };
}
