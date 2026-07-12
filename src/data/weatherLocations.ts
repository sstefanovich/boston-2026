/** Where to pull weather for each itinerary day */
export interface DayWeatherLocation {
  label: string;
  lat: number;
  lng: number;
}

export const DAY_WEATHER_LOCATIONS: Record<string, DayWeatherLocation> = {
  aug8: { label: 'Newbury St, Back Bay', lat: 42.3493, lng: -71.0827 },
  aug9: { label: 'Newbury St, Back Bay', lat: 42.3493, lng: -71.0827 },
  aug10: { label: 'Boston Harbor', lat: 42.3591, lng: -71.0498 },
  aug11: { label: 'Cambridge', lat: 42.3736, lng: -71.1097 },
  aug12: { label: 'Logan Airport', lat: 42.3656, lng: -71.0096 },
};
