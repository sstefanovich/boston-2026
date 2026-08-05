export interface TransitLink {
  label: string;
  url: string;
  note?: string;
}

export const TRANSIT_BY_DAY: Record<string, TransitLink[]> = {
  aug8: [
    { label: 'MBTA Trip Planner', url: 'https://www.mbta.com/trip-planner', note: 'Silver Line SL1 from Logan after UA1606 lands' },
    { label: 'Logan Airport', url: 'https://www.massport.com/logan-airport/', note: 'UA1606 arrives 2:02 PM' },
  ],
  aug9: [
    {
      label: 'Old Town Trolley',
      url: 'https://www.trolleytours.com/boston',
      note: 'Hop-on hop-off all day · nearest stop Copley Square / Trinity Church',
    },
    { label: 'MBTA — The T', url: 'https://www.mbta.com/', note: 'Backup if you skip a trolley loop' },
    { label: 'Freedom Trail map', url: 'https://www.thefreedomtrail.org/', note: 'Walk segments between trolley stops' },
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
    { label: 'Logan Airport', url: 'https://www.massport.com/logan-airport/', note: 'UA472 departs 12:27 PM — leave ~10:30 AM' },
    { label: 'MBTA to Logan', url: 'https://www.mbta.com/schedules/SL1/line', note: 'Silver Line SL1' },
  ],
};

export function getTransitForDay(dayId: string): TransitLink[] {
  return TRANSIT_BY_DAY[dayId] ?? [];
}
