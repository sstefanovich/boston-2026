/** Parse calendar stamp YYYYMMDDHHMMSS (trip-local Eastern time). */
function formatCalTime(stamp: string): string {
  const hour = parseInt(stamp.slice(8, 10), 10);
  const minute = stamp.slice(10, 12);
  const h12 = hour % 12 || 12;
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${h12}:${minute} ${period}`;
}

/** e.g. "10:00 AM – 1:00 PM" or "6:10 PM – 3:20 AM (next day)" */
export function formatEventTimeRange(start: string, end: string): string {
  const startTime = formatCalTime(start);
  const endTime = formatCalTime(end);
  if (start.slice(0, 8) === end.slice(0, 8)) {
    return `${startTime} – ${endTime}`;
  }
  return `${startTime} – ${endTime} (next day)`;
}
