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
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
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
  const ready = diameter > 0;
  const center = diameter / 2;
  const metricW = diameter * 0.24;
  const metricH = diameter * 0.1;
  const halfW = metricW / 2;
  const halfH = metricH / 2;

  const ringR = center - Math.max(halfW, halfH) - diameter * 0.05;
  const angleStep = (2 * Math.PI) / metrics.length;

  return (
    <section className="container">
      <div className="mx-auto max-w-[560px] px-4 sm:px-0 mb-2">
        <div className="text-white/90 font-medium truncate">
          {data.name}, {data.sys.country}
        </div>
        <div className="text-xs text-white/70">{fmtTime(data.dt, data.timezone, 'EEEE')}</div>
      </div>

      <div className="mx-auto mt-2 flex max-w-[560px] items-center justify-center px-3">
        <div
          ref={circleRef}
          className="
            relative aspect-square w-[92vw] sm:w-[88vw] max-w-[560px] rounded-full
            bg-white/10 backdrop-blur-2xl border border-white/20 overflow-hidden
            shadow-[0_18px_60px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.35)]
          "
        >
          <div className="pointer-events-none absolute inset-[6%] rounded-full border border-white/25 shadow-[inset_0_0_80px_rgba(0,0,0,.22)]" />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
            <img src={icon} alt={w.description} className="h-[18%] w-[18%] mb-2" />

            <div
              className="
                font-semibold leading-none drop-shadow-[0_6px_18px_rgba(0,0,0,.45)]
                text-[clamp(36px,12vw,100px)]
              "
            >
              {Math.round(data.main.temp)}°
            </div>

            <div className="mt-2 text-white/85 capitalize line-clamp-1 max-w-[80%] text-[clamp(12px,2.5vw,18px)]">
              {w.description}
            </div>
            <div className="text-white/60 mt-0.5 text-[clamp(11px,2.3vw,16px)]">
              Feels like {Math.round(data.main.feels_like)}°
            </div>
          </div>

          {ready &&
            metrics.map((m, i) => {
              const angle = -Math.PI / 2 + i * angleStep;
              const cx = center + ringR * Math.cos(angle);
              const cy = center + ringR * Math.sin(angle);

              return (
                <div
                  key={i}
                  className="absolute text-center text-white/90"
                  style={{
                    left: cx - halfW,
                    top: cy - halfH,
                    width: metricW,
                    height: metricH,
                    fontSize: `${diameter * 0.04}px`,
                  }}
                >
                  <div className="opacity-80 whitespace-nowrap leading-none">{m.label}</div>
                  <div className="font-medium whitespace-nowrap">{m.value}</div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
