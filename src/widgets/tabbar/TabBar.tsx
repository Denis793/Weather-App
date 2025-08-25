import { cn } from '@/shared/lib/cn';
type Tab = 'now' | 'forecast';

export function TabBar({ current, onChange }: { current: Tab; onChange: (t: Tab) => void }) {
  const btn = (t: Tab, label: string) => (
    <button
      onClick={() => onChange(t)}
      className={cn(
        'px-4 py-1.5 rounded-full text-sm border transition',
        current === t
          ? 'bg-white/80 text-black border-white/60 shadow-[0_4px_16px_rgba(0,0,0,.25)]'
          : 'bg-white/20 text-white/90 border-white/25 hover:bg-white/30'
      )}
    >
      {label}
    </button>
  );
  return (
    <div className="fixed inset-x-0 bottom-5 z-50">
      <div className="container">
        <div className="mx-auto w-fit rounded-full border border-white/25 bg-white/15 px-2 py-2 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,.35)]">
          <div className="flex items-center gap-2">
            {btn('now', 'Now')}
            {btn('forecast', 'Forecast')}
          </div>
        </div>
      </div>
    </div>
  );
}
