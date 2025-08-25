import { useState } from 'react';
import { NowPage } from '@/pages/now/ui/NowPage';
import { ForecastPage } from '@/pages/forecast/ui/ForecastPage';
import { TabBar } from '@/widgets/tabbar/TabBar';

export default function App() {
  const [tab, setTab] = useState<'now' | 'forecast'>('now');
  const [city, setCity] = useState('Warsaw');

  return (
    <>
      {tab === 'now' && <NowPage city={city} onPick={(c) => setCity(c)} />}
      {tab === 'forecast' && <ForecastPage city={city} />}

      <TabBar current={tab} onChange={setTab} />
    </>
  );
}
