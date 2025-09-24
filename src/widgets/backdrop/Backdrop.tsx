import { cn } from '@/shared/lib/cn';

export function Backdrop({ src, children }: { src: string; children?: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center w-full overflow-hidden">
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_300px_rgba(0,0,0,.45)]" />

      <div
        className={cn(
          'relative z-10 w-full max-w-2xl px-4 sm:px-6 md:px-8',
          'py-2 sm:pt-16 sm:pb-32 md:pt-20 md:pb-36'
        )}
      >
        {children}
      </div>
    </div>
  );
}
