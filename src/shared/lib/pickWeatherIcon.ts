import {
  clearDay,
  clearNight,
  cloudsDay,
  cloudsNight,
  rainDay,
  rainNight,
  drizzleDay,
  drizzleNight,
  thunder,
  snow,
  mist,
} from '@/shared/assets/backdrops';

// Коди погоди OWM: https://openweathermap.org/weather-conditions
export function pickWeatherIcon(code: number, isDay: boolean): string {
  if (code >= 200 && code < 300) return thunder;
  if (code >= 300 && code < 400) return isDay ? drizzleDay : drizzleNight;
  if (code >= 500 && code < 600) return isDay ? rainDay : rainNight;
  if (code >= 600 && code < 700) return snow;
  if (code >= 700 && code < 800) return mist;
  if (code === 800) return isDay ? clearDay : clearNight;
  if (code > 800) return isDay ? cloudsDay : cloudsNight;
  return isDay ? clearDay : clearNight;
}
