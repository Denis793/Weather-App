import { useNowWeather, useForecast } from '@/entities/weather/model/queries';
import { Backdrop } from '@/widgets/backdrop/Backdrop';
import { NowCard } from '@/widgets/now-card/NowCard';
import { HourlyStrip } from '@/widgets/hourly-strip/HourlyStrip';
import { pickBackdrop } from '@/shared/assets/backdrops';
import { isDayBySun } from '@/shared/lib/time';
import { SearchCity } from '@/features/search-city/ui/SearchCity';
export function NowPage({ city, onPick }: { city: string; onPick: (c: string) => void }) {
  const now = useNowWeather(city);
  const fc = useForecast(city);

  if (now.isLoading) return <div className="p-6">Loading...</div>;
  if (now.error) return <div className="p-6 text-red-300">Error: {now.error.message}</div>;
  if (!now.data) return null;

  const w = now.data.weather[0];
  const isDay = isDayBySun(now.data.dt, now.data.sys.sunrise, now.data.sys.sunset);
  const bg = pickBackdrop(w.id, isDay);

  return (
    <Backdrop src={bg}>
      <div className="container mb-4">
        <SearchCity onPick={onPick} />
      </div>

      <NowCard data={now.data} />
      {fc.data && <HourlyStrip items={fc.data.list} tz={fc.data.city.timezone} />}
    </Backdrop>
  );
}
