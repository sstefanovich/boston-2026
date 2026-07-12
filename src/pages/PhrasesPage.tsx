import { useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { PhraseRow } from '../components/PhraseRow';
import { BOSTON_DISHES, BOSTON_SLANG, CITY_IMAGES } from '../data/content';

export function PhrasesPage() {
  const [tab, setTab] = useState<'slang' | 'dishes'>('slang');
  const phrases = tab === 'slang' ? BOSTON_SLANG : BOSTON_DISHES;

  return (
    <>
      <HeroBanner
        title="Local Lingo"
        subtitle={tab === 'slang' ? 'Boston slang · tap 🔊 to hear' : 'Classic dishes · what to order'}
        image={tab === 'slang' ? CITY_IMAGES.boston : CITY_IMAGES.food}
        theme={tab === 'slang' ? 'boston' : 'food'}
      />
      <div className="tabs">
        <button type="button" className={`tab ${tab === 'slang' ? 'active' : ''}`} onClick={() => setTab('slang')}>
          🗣️ Boston slang
        </button>
        <button type="button" className={`tab ${tab === 'dishes' ? 'active' : ''}`} onClick={() => setTab('dishes')}>
          🦞 Local dishes
        </button>
      </div>
      <div className="card card-phrases">
        {phrases.map((p) => (
          <PhraseRow key={p.foreign} phrase={p} lang="en-US" />
        ))}
      </div>
    </>
  );
}
