// path: src/pages/locations/ui/LocationsPage.tsx
import { Backdrop } from '@/widgets/backdrop/Backdrop';
import { SearchCity } from '@/features/search-city/ui/SearchCity';
import clearDay from '@/assets/img/backdrops/clear-day.svg';

export function LocationsPage({ onPick }: { onPick: (city: string) => void }) {
  return (
    <Backdrop src={clearDay}>
      <div className="container">
        <div className="glass max-w-xl mx-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Choose location</h2>
          <SearchCity onPick={onPick} />
        </div>
      </div>
    </Backdrop>
  );
}
