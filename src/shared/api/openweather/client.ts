// path: src/shared/api/openweather/client.ts
import axios from 'axios';
import { OWM_KEY, OWM_LANG, OWM_UNITS } from '@/shared/config/env';

export const owm = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 12000,
});

owm.interceptors.request.use((cfg) => {
  cfg.params = {
    ...(cfg.params ?? {}),
    appid: OWM_KEY,
    lang: OWM_LANG,
    units: OWM_UNITS,
  };
  return cfg;
});

export type WeatherNow = {
  name: string;
  dt: number;
  timezone: number;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min?: number; temp_max?: number };
  visibility: number;
  wind: { speed: number; deg?: number };
  clouds?: { all: number };
  weather: { id: number; main: string; description: string; icon: string }[];
};

export type ForecastItem = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: { id: number; description: string; icon: string }[];
  wind: { speed: number; deg?: number };
  pop?: number;
  rain?: { '3h'?: number };
  snow?: { '3h'?: number };
  clouds?: { all: number };
};

export type ForecastResponse = {
  city: { sunrise: number; sunset: number; timezone: number; name: string };
  list: ForecastItem[];
};

export const api = {
  nowByCity: (q: string) => owm.get<WeatherNow>('/data/2.5/weather', { params: { q } }).then((r) => r.data),
  forecastByCity: (q: string) => owm.get<ForecastResponse>('/data/2.5/forecast', { params: { q } }).then((r) => r.data),
  geoDirect: (q: string, limit = 5) =>
    owm
      .get<Array<{ name: string; country: string; state?: string; lat: number; lon: number }>>('/geo/1.0/direct', {
        params: { q, limit },
      })
      .then((r) => r.data),
};
