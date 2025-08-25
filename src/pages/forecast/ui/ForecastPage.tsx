// path: src/pages/forecast/ui/ForecastPage.tsx
import { useForecast } from '@/entities/weather/model/queries';
import { Backdrop } from '@/widgets/backdrop/Backdrop';
import cloudsDay from '@/assets/img/backdrops/overcast-day.svg';

export function ForecastPage({ city }: { city: string }) {
  const q = useForecast(city);
  if (q.isLoading) return <div className="p-6">Loading...</div>;
  if (q.error) return <div className="p-6 text-red-300">Error: {q.error.message}</div>;
  if (!q.data) return null;

  return (
    <Backdrop src={cloudsDay}>
      <div className="container">
        <div className="glass max-w-3xl mx-auto p-6">
          <h2 className="text-xl font-semibold mb-4">5-day / 3h forecast</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {q.data.list.slice(0, 16).map((it) => (
              <div key={it.dt} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                <div className="text-white/80">
                  {new Date((it.dt + q.data.city.timezone) * 1000).toLocaleString([], {
                    weekday: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <img src={`https://openweathermap.org/img/wn/${it.weather[0].icon}.png`} />
                  <div className="font-medium">{Math.round(it.main.temp)}°</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}
