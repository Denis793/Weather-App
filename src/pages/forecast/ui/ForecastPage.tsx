import { useEffect, useMemo, useState } from 'react';
import { useForecast } from '@/entities/weather/model/queries';
import { Backdrop } from '@/widgets/backdrop/Backdrop';
import { pickBackdrop, uiIcons } from '@/shared/assets/backdrops';
import { pickWeatherIcon } from '@/shared/lib/pickWeatherIcon';
import type { ForecastItem } from '@/shared/api/openweather/client';

/* ─ helpers ─ */
const toLocal = (unix: number, tz: number) => new Date((unix + tz) * 1000);

function dayKey(unix: number, tz: number) {
  const d = toLocal(unix, tz);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function weekdayLabel(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

function windDir(deg?: number) {
  if (deg == null) return '—';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function sumPrecip(it: ForecastItem) {
  const r = it.rain?.['3h'] ?? 0;
  const s = it.snow?.['3h'] ?? 0;
  return r + s;
}

function mm(v: number) {
  return `${v.toFixed(1)} mm`;
}

type ForecastItemWithVis = ForecastItem & { visibility?: number };

type DayBucket = {
  key: string;
  date: Date;
  items: ForecastItem[];
  min: number;
  max: number;
  feelsMin: number;
  feelsMax: number;
  humAvg: number;
  humMin: number;
  humMax: number;
  presAvg: number;
  presMin: number;
  presMax: number;
  windAvg: number;
  windMax: number;
  windDirDominant: string;
  precipSum: number;
  popAvgPct: number;
  popMaxPct: number;
  cloudsAvg: number;
  visibilityAvg?: number;
  repr: ForecastItem;
};

function buildDays(list: ForecastItem[], tz: number): DayBucket[] {
  const map = new Map<string, ForecastItem[]>();
  for (const it of list) {
    const k = dayKey(it.dt, tz);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(it);
  }

  const days: DayBucket[] = [];
  for (const [k, itemsUnsorted] of map) {
    const items = [...itemsUnsorted].sort((a, b) => a.dt - b.dt);

    const temps = items.map((i) => i.main.temp);
    const feels = items.map((i) => i.main.feels_like);
    const hums = items.map((i) => i.main.humidity ?? 0);
    const press = items.map((i) => i.main.pressure ?? 0);
    const winds = items.map((i) => i.wind?.speed ?? 0);
    const pops = items.map((i) => (i.pop ?? 0) * 100);
    const clouds = items.map((i) => i.clouds?.all ?? 0);
    const visArr = (items as ForecastItemWithVis[])
      .map((i) => i.visibility)
      .filter((v): v is number => typeof v === 'number');

    // dominant wind direction
    const hist = new Map<string, number>();
    for (const it of items) {
      const dir = windDir(it.wind?.deg);
      hist.set(dir, (hist.get(dir) ?? 0) + 1);
    }
    const windDirDominant = [...hist.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    // representative item (closest to 12:00 local)
    const noon = new Date(toLocal(items[0].dt, tz));
    noon.setUTCHours(12, 0, 0, 0);
    let repr = items[0];
    let best = Infinity;
    for (const it of items) {
      const diff = Math.abs(toLocal(it.dt, tz).getTime() - noon.getTime());
      if (diff < best) {
        best = diff;
        repr = it;
      }
    }

    const precipSum = items.reduce((s, i) => s + sumPrecip(i), 0);
    const visibilityAvg = visArr.length ? Math.round(visArr.reduce((s, v) => s + v, 0) / visArr.length) : undefined;

    days.push({
      key: k,
      date: toLocal(items[0].dt, tz),
      items,
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps)),
      feelsMin: Math.round(Math.min(...feels)),
      feelsMax: Math.round(Math.max(...feels)),
      humAvg: Math.round(hums.reduce((s, v) => s + v, 0) / hums.length),
      humMin: Math.round(Math.min(...hums)),
      humMax: Math.round(Math.max(...hums)),
      presAvg: Math.round(press.reduce((s, v) => s + v, 0) / press.length),
      presMin: Math.round(Math.min(...press)),
      presMax: Math.round(Math.max(...press)),
      windAvg: Math.round(winds.reduce((s, v) => s + v, 0) / winds.length),
      windMax: Math.round(Math.max(...winds)),
      windDirDominant,
      precipSum,
      popAvgPct: Math.round(pops.reduce((s, v) => s + v, 0) / pops.length),
      popMaxPct: Math.round(Math.max(...pops)),
      cloudsAvg: Math.round(clouds.reduce((s, v) => s + v, 0) / clouds.length),
      visibilityAvg,
      repr,
    });
  }

  // remove "today" => start from tomorrow
  const nowUtc = Math.floor(Date.now() / 1000);
  const today = dayKey(nowUtc - tz, tz);
  const filtered = [...days].filter((d) => d.key !== today);
  filtered.sort((a, b) => a.items[0].dt - b.items[0].dt);
  return filtered;
}

/* ─ UI ─ */
type CityMeta = { name: string; timezone: number; country?: string; sunrise?: number; sunset?: number };

export function ForecastPage({ city }: { city: string }) {
  const q = useForecast(city);
  const list = q.data?.list ?? [];
  const meta = (q.data?.city ?? { name: '', timezone: 0 }) as CityMeta;
  const tz = meta.timezone ?? 0;

  const days = useMemo(() => buildDays(list, tz), [list, tz]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (days.length > 0) setSelected((prev) => prev ?? days[0].key);
  }, [days.length]);

  if (q.isLoading) return <div className="p-6">Loading...</div>;
  if (q.error) return <div className="p-6 text-red-300">Error: {q.error.message}</div>;
  if (!q.data) return null;

  const active = days.find((d) => d.key === selected) ?? days[0];

  const isDay = true;
  const bg = pickBackdrop(active.repr.weather[0].id, isDay);
  const icon = pickWeatherIcon(active.repr.weather[0].id, isDay);

  return (
    <Backdrop src={bg}>
      <div className="container py-6">
        {/* header */}
        <div className="mx-auto max-w-5xl mb-4 px-2">
          <div className="text-white/90 font-medium">
            {meta.name}
            {meta.country ? `, ${meta.country}` : ''}
          </div>
          <div className="text-xs text-white/70">
            {active.date.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'short' })}
          </div>
        </div>

        {/* day details */}
        <div className="glass mx-auto max-w-5xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <img src={icon} alt={active.repr.weather[0].description} className="h-12 w-12" />
            <div className="text-3xl font-semibold">
              {active.min}° / {active.max}°
            </div>
            <div className="ml-auto text-right text-white/85">
              <div className="capitalize">{active.repr.weather[0].description}</div>
              <div className="text-xs text-white/70">
                clouds {active.cloudsAvg}% • PoP avg {active.popAvgPct}% (max {active.popMaxPct}%)
              </div>
            </div>
          </div>

          {/* metrics grid */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Metric icon={uiIcons.thermometer} label="Feels like" value={`${active.feelsMin}° / ${active.feelsMax}°`} />
            <Metric
              icon={uiIcons.humidity}
              label="Humidity"
              value={`${active.humAvg}% (min ${active.humMin} / max ${active.humMax})`}
            />
            <Metric
              icon={uiIcons.pressure}
              label="Pressure"
              value={`${active.presAvg} hPa (min ${active.presMin} / max ${active.presMax})`}
            />
            <Metric
              icon={uiIcons.wind}
              label="Wind"
              value={`${windDir(active.repr.wind?.deg)} ${active.windAvg} m/s (max ${active.windMax})`}
            />
            <Metric
              icon={uiIcons.precip}
              label="Precip."
              value={`${mm(active.precipSum)} • PoP max ${active.popMaxPct}%`}
            />
            <Metric icon={uiIcons.visibility} label="Cloudiness" value={`${active.cloudsAvg}%`} />
            {active.visibilityAvg != null && (
              <Metric
                icon={uiIcons.visibility}
                label="Visibility"
                value={`${(active.visibilityAvg / 1000).toFixed(1)} km`}
              />
            )}
          </div>
        </div>

        {/* days strip */}
        <div className="mx-auto max-w-5xl mt-5">
          <div className="flex gap-3 overflow-x-auto pb-2 pr-1">
            {days.map((d) => {
              const dayIcon = pickWeatherIcon(d.repr.weather[0].id, true);
              const isActive = d.key === active.key;
              return (
                <button
                  key={d.key}
                  onClick={() => setSelected(d.key)}
                  className={[
                    'min-w-[140px] rounded-xl border px-3 py-2 text-left',
                    'backdrop-blur bg-white/10 border-white/15 transition',
                    isActive ? 'ring-2 ring-white/40' : 'hover:bg-white/15',
                  ].join(' ')}
                >
                  <div className="text-sm font-medium">{weekdayLabel(d.date)}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <img src={dayIcon} className="h-8 w-8" alt="" />
                    <div className="font-semibold">
                      {d.min}° / {d.max}°
                    </div>
                  </div>
                  <div className="text-xs text-white/70 capitalize mt-1 line-clamp-1">
                    {d.repr.weather[0].description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

/* small UI */
function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <img src={icon} alt="" className="h-10 w-10 opacity-80" />
        <div className="text-[11px] uppercase tracking-wide text-white/70">{label}</div>
      </div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
