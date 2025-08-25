import { fromUnixTime, format } from 'date-fns';

export const fmtTime = (unix: number, tzOffsetSec: number, mask = 'HH:mm') => {
  const d = new Date((unix + tzOffsetSec) * 1000);
  return format(d, mask);
};

export const isDayBySun = (dt: number, sunrise: number, sunset: number) => dt >= sunrise && dt <= sunset;
