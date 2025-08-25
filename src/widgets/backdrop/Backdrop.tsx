import { cn } from '@/shared/lib/cn';

export function Backdrop({ src, children }: { src: string; children?: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70" />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_300px_rgba(0,0,0,.45)]" />
      <div className={cn('relative z-10 pt-6 pb-36')}>{children}</div>
    </div>
  );
}
