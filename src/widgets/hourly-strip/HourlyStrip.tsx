import { ForecastItem } from '@/shared/api/openweather/client';
import { uiIcons } from '@/shared/assets/backdrops';
import { pickWeatherIcon } from '@/shared/lib/pickWeatherIcon';

function windDir(deg?: number) {
  if (deg == null) return '—';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}
const mm3h = (v?: number) => (v == null ? '0 mm' : `${v.toFixed(1)} mm`);

export function HourlyStrip({ items, tz, take = 10 }: { items: ForecastItem[]; tz: number; take?: number }) {
  const slice = items.slice(0, take);
  const nowH = new Date().getUTCHours();

  return (
    <div className="container mt-6">
      <div className="flex gap-3 overflow-x-auto pb-2 pr-3">
        {slice.map((it) => {
          const d = new Date((it.dt + tz) * 1000);
          const isActive = d.getHours() === nowH;
          const w = it.weather[0];
          const isDay = /d$/.test(w.icon);
          const icon = pickWeatherIcon(w.id, isDay);
          const rain3h = it.rain?.['3h'] ?? 0;
          const snow3h = it.snow?.['3h'] ?? 0;
          const precip3h = rain3h + snow3h;
          const pop = it.pop;

          return (
            <div
              key={it.dt}
              className={[
                'min-w-[160px] rounded-[18px] border px-3 py-2 text-center',
                'shadow-[0_6px_18px_rgba(0,0,0,.25)] backdrop-blur-xl',
                isActive
                  ? 'bg-gradient-to-b from-white/75 to-white/35 border-white/40 text-black'
                  : 'bg-white/15 border-white/20 text-white/90',
              ].join(' ')}
            >
              <div
                className={isActive ? 'text-[11px] font-medium text-black/70' : 'text-[11px] font-medium text-white/80'}
              >
                {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              <img src={icon} alt={w.description} className="mx-auto h-10 w-10" />

              <div className="text-base font-semibold">{Math.round(it.main.temp)}°</div>

              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] leading-tight">
                <Detail icon={uiIcons.thermometer} value={`${Math.round(it.main.feels_like)}°`} active={isActive} />
                <Detail icon={uiIcons.humidity} value={`${it.main.humidity}%`} active={isActive} />
                <Detail
                  icon={uiIcons.wind}
                  value={`${windDir(it.wind.deg)} ${Math.round(it.wind.speed)} m/s`}
                  active={isActive}
                />
                <Detail icon={uiIcons.pressure} value={`${Math.round(it.main.pressure)} hPa`} active={isActive} />

                <Detail
                  icon={uiIcons.precip}
                  value={pop != null ? `${Math.round(pop * 100)}%` : '—'}
                  active={isActive}
                />
                <Detail icon={uiIcons.dew} value={precip3h > 0 ? mm3h(precip3h) : '0 mm'} active={isActive} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ icon, value, active }: { icon: string; value: string; active: boolean }) {
  return (
    <div
      className={[
        'flex items-center gap-1 rounded-md px-2 py-1',
        active ? 'bg-black/5 text-black/80' : 'bg-black/20 text-white/85',
      ].join(' ')}
      title={value}
    >
      <img src={icon} alt="" className="h-3.5 w-3.5 opacity-80" />
      <span className="font-medium">{value}</span>
    </div>
  );
}
