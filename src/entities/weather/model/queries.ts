import { useQuery } from '@tanstack/react-query';
import { api, WeatherNow, ForecastResponse } from '@/shared/api/openweather/client';

export const useNowWeather = (city: string) =>
  useQuery<WeatherNow, Error>({
    queryKey: ['now', city],
    queryFn: () => api.nowByCity(city),
    enabled: !!city,
    staleTime: 1000 * 60, // 1 хв
  });

export const useForecast = (city: string) =>
  useQuery<ForecastResponse, Error>({
    queryKey: ['forecast', city],
    queryFn: () => api.forecastByCity(city),
    enabled: !!city,
    staleTime: 1000 * 60 * 5,
  });
