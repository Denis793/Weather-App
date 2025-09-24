import { useState } from 'react';
import { api } from '@/shared/api/openweather/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = { onPick: (city: string) => void };

export function SearchCity({ onPick }: Props) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Array<{ name: string; state?: string; country: string }>>([]);

  const search = async () => {
    setLoading(true);
    try {
      const res = await api.geoDirect(q, 8);
      setItems(res.map((r) => ({ name: r.name, state: r.state, country: r.country })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter city..."
            className="w-full sm:flex-1 text-white placeholder:text-white/50"
          />

          <Button onClick={search} disabled={!q || loading} className="w-full sm:w-auto">
            {loading ? '...' : 'Find'}
          </Button>
        </div>

        {items.length > 0 && (
          <ScrollArea className="max-h-48 sm:max-h-64">
            <ul className="space-y-2">
              {items.map((it, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 border border-white/10 text-sm sm:text-base"
                    onClick={() => onPick(`${it.name}${it.state ? `, ${it.state}` : ''}, ${it.country}`)}
                  >
                    {it.name}
                    {it.state ? `, ${it.state}` : ''} — {it.country}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </div>
    </>
  );
}
