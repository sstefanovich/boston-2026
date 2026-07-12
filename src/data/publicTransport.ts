export interface TransitLink {
  label: string;
  url: string;
  note?: string;
}

export const TRANSIT_BY_DAY: Record<string, TransitLink[]> = {
  aug8: [
    { label: 'MBTA Trip Planner', url: 'https://www.mbta.com/trip-planner', note: 'Silver Line SL1 from Logan after UA1117 lands' },
    { label: 'Logan Airport', url: 'https://www.massport.com/logan-airport/', note: 'UA1117 arrives 12:47 PM' },
  ],
  aug9: [
    { label: 'MBTA — The T', url: 'https://www.mbta.com/', note: 'Subway & buses' },
    { label: 'Freedom Trail map', url: 'https://www.thefreedomtrail.org/', note: 'Mostly walking' },
  ],
  aug10: [
    {
      label: 'MBTA to Haymarket',
      url: 'https://www.mbta.com/stops/place-haecl',
      note: 'Food tour meetup at 156 Blackstone St (near Haymarket / Greenway)',
    },
    { label: 'MBTA', url: 'https://www.mbta.com/', note: 'After tour — Charlestown Navy Yard' },
    { label: 'Boston Harbor ferries', url: 'https://www.bostonharborcruises.com/', note: 'Optional harbor cruise' },
  ],
  aug11: [
    { label: 'MBTA Red Line', url: 'https://www.mbta.com/schedules/Red', note: 'To Harvard / Kendall (MIT)' },
    { label: 'Fenway Park', url: 'https://www.mlb.com/redsox/ballpark', note: 'Green Line to Kenmore' },
  ],
  aug12: [
    { label: 'Logan Airport', url: 'https://www.massport.com/logan-airport/', note: 'UA1732 departs 12:20 PM — leave ~10:30 AM' },
    { label: 'MBTA to Logan', url: 'https://www.mbta.com/schedules/SL1/line', note: 'Silver Line SL1' },
  ],
};

export function getTransitForDay(dayId: string): TransitLink[] {
  return TRANSIT_BY_DAY[dayId] ?? [];
}
