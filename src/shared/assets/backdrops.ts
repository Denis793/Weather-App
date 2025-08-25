// WEATHER
import clearDay from '@/assets/img/backdrops/clear-day.svg';
import clearNight from '@/assets/img/backdrops/clear-night.svg';
import cloudsDay from '@/assets/img/backdrops/overcast-day.svg';
import cloudsNight from '@/assets/img/backdrops/partly-cloudy-night.svg';
import rainDay from '@/assets/img/backdrops/overcast-day-rain.svg';
import rainNight from '@/assets/img/backdrops/overcast-night-rain.svg';
import drizzleDay from '@/assets/img/backdrops/overcast-day-drizzle.svg';
import drizzleNight from '@/assets/img/backdrops/overcast-night-drizzle.svg';
import thunder from '@/assets/img/backdrops/lightning-bolt.svg';
import snow from '@/assets/img/backdrops/snow.svg';
import mist from '@/assets/img/backdrops/mist.svg';

// UI
import high from '@/assets/img/backdrops/pressure-high.svg';
import low from '@/assets/img/backdrops/pressure-low.svg';
import celsius from '@/assets/img/backdrops/celsius.svg';
import wind from '@/assets/img/backdrops/wind.svg';
import pressure from '@/assets/img/backdrops/barometer.svg';
import visibility from '@/assets/img/backdrops/horizon.svg';
import humidity from '@/assets/img/backdrops/humidity.svg';
import sunrise from '@/assets/img/backdrops/sunrise.svg';
import sunset from '@/assets/img/backdrops/sunset.svg';
import dew from '@/assets/img/backdrops/raindrop.svg';
import precip from '@/assets/img/backdrops/raindrops.svg';
import thermometer from '@/assets/img/backdrops/thermometer.svg';

// WIND
import b0 from '@/assets/img/backdrops/wind-beaufort-0.svg';
import b1 from '@/assets/img/backdrops/wind-beaufort-1.svg';
import b2 from '@/assets/img/backdrops/wind-beaufort-2.svg';
import b3 from '@/assets/img/backdrops/wind-beaufort-3.svg';
import b4 from '@/assets/img/backdrops/wind-beaufort-4.svg';
import b5 from '@/assets/img/backdrops/wind-beaufort-5.svg';
import b6 from '@/assets/img/backdrops/wind-beaufort-6.svg';
import b7 from '@/assets/img/backdrops/wind-beaufort-7.svg';
import b8 from '@/assets/img/backdrops/wind-beaufort-8.svg';
import b9 from '@/assets/img/backdrops/wind-beaufort-9.svg';
import b10 from '@/assets/img/backdrops/wind-beaufort-10.svg';
import b11 from '@/assets/img/backdrops/wind-beaufort-11.svg';
import b12 from '@/assets/img/backdrops/wind-beaufort-12.svg';

export const windBeaufort = [b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12];

export const uiIcons = {
  high,
  low,
  celsius,
  wind,
  pressure,
  visibility,
  humidity,
  sunrise,
  sunset,
  dew,
  precip,
  thermometer,
};

export {
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
};

export function pickBackdrop(code: number, isDay: boolean) {
  if (code >= 200 && code < 300) return thunder;
  if (code >= 300 && code < 400) return isDay ? drizzleDay : drizzleNight;
  if (code >= 500 && code < 600) return isDay ? rainDay : rainNight;
  if (code >= 600 && code < 700) return snow;
  if (code >= 700 && code < 800) return mist;
  if (code === 800) return isDay ? clearDay : clearNight;
  if (code > 800) return isDay ? cloudsDay : cloudsNight;
  return isDay ? clearDay : clearNight;
}
