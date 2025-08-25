import { useEffect, useMemo, useRef, useState } from 'react';
import { WeatherNow } from '@/shared/api/openweather/client';
import { fmtTime, isDayBySun } from '@/shared/lib/time';
import { pickWeatherIcon } from '@/shared/lib/pickWeatherIcon';

function windDir(deg?: number) {
  if (deg == null) return '—';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setSize({ width: cr.width, height: cr.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

export function NowCard({ data }: { data: WeatherNow }) {
  const w = data.weather[0];
  const isDay = isDayBySun(data.dt, data.sys.sunrise, data.sys.sunset);
  const icon = pickWeatherIcon(w.id, isDay);
  const min = Math.round(data.main.temp_min ?? data.main.temp);
  const max = Math.round(data.main.temp_max ?? data.main.temp);

  const metrics = useMemo(
    () => [
      { label: 'Min', value: `${min}°` },
      { label: 'Max', value: `${max}°` },
      { label: 'Humidity', value: `${data.main.humidity}%` },
      { label: 'Pressure', value: `${data.main.pressure} hPa` },
      { label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km` },
      { label: 'Wind', value: `${windDir(data.wind.deg)} ${Math.round(data.wind.speed)} m/s` },
    ],
    [min, max, data]
  );

  const { ref: circleRef, size } = useElementSize<HTMLDivElement>();
  const diameter = Math.min(size.width, size.height);
  const center = diameter / 2;
  const metricW = Math.max(72, Math.min(120, diameter * 0.22));
  const metricH = Math.max(38, Math.min(52, diameter * 0.09));
  const metricHalfW = metricW / 2;
  const metricHalfH = metricH / 2;
  const padding = Math.max(20, diameter * 0.04);
  const ringRadius = Math.max(0, center - padding - Math.max(metricHalfW, metricHalfH));

  const angleStep = (2 * Math.PI) / metrics.length;

  return (
    <section className="container">
      <div className="mx-auto mt-6 flex max-w-[560px] items-center justify-center">
        <div
          ref={circleRef}
          className="
            relative aspect-square w-[88vw] max-w-[560px] rounded-full
            bg-white/10 backdrop-blur-2xl border border-white/20
            shadow-[0_18px_60px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.35)]
          "
        >
          <div className="pointer-events-none absolute inset-6 rounded-full border border-white/25 shadow-[inset_0_0_80px_rgba(0,0,0,.22)]" />

          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
            <div className="text-left">
              <div className="font-medium">
                {data.name}, {data.sys.country}
              </div>
              <div className="text-xs text-white/70">{fmtTime(data.dt, data.timezone, 'EEEE • HH:mm')}</div>
            </div>

            <img alt={w.description} src={icon} className="h-24 w-24 mb-4" />

            <div className="text-8xl md:text-9xl font-semibold leading-none drop-shadow-[0_6px_18px_rgba(0,0,0,.45)]">
              {Math.round(data.main.temp)}°
            </div>

            <div className="mt-3 text-white/85 capitalize">{w.description}</div>

            <div className="text-white/60 text-sm mt-1">Feels like {Math.round(data.main.feels_like)}°</div>
          </div>

          {diameter > 0 &&
            metrics.map((m, i) => {
              const angle = -Math.PI / 2 + i * angleStep;
              const xCenter = center + ringRadius * Math.cos(angle);
              const yCenter = center + ringRadius * Math.sin(angle);

              const left = xCenter - metricHalfW;
              const top = yCenter - metricHalfH;

              return (
                <div
                  key={i}
                  className="absolute text-center text-white/90"
                  style={{
                    left,
                    top,
                    width: metricW,
                    height: metricH,
                  }}
                >
                  <div className="text-[11px] leading-none mb-1 opacity-80">{m.label}</div>
                  <div className="font-medium">{m.value}</div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
