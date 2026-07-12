import { formatClockInZone } from '../utils/parisTime';

const HOME_TZ = 'America/Chicago';
const TRIP_TZ = 'America/New_York';

export function TimeZoneBar() {
  const now = new Date();
  const local = formatClockInZone(TRIP_TZ, now);
  const home = formatClockInZone(HOME_TZ, now);

  return (
    <div className="timezone-bar card-compact" role="status">
      <span>
        <strong>Boston</strong> {local}
      </span>
      <span className="timezone-sep">·</span>
      <span>
        <strong>Chicago</strong> {home}
      </span>
    </div>
  );
}
