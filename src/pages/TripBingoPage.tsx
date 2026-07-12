import { useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { notifyBingoUpdate } from '../components/TripBingoHomeCard';
import { CITY_IMAGES } from '../data/content';
import { TRIP_BINGO_ITEMS } from '../data/tripBingo';
import { bingoHasMap, bingoMapUrl } from '../utils/bingoMap';
import { openUrl } from '../utils/links';
import { clearBingo, getBingoChecked, toggleBingoItem } from '../utils/tripBingoStorage';

const REGION_LABEL: Record<string, string> = {
  boston: 'Boston',
  harbor: 'Harbor',
  any: 'Anytime',
};

export function TripBingoPage() {
  const [checked, setChecked] = useState(() => getBingoChecked());

  const total = TRIP_BINGO_ITEMS.length;
  const count = checked.size;
  const complete = count === total;

  const handleToggle = (id: string) => {
    const next = toggleBingoItem(id);
    setChecked(new Set(next));
    notifyBingoUpdate();
  };

  const handleReset = () => {
    if (!window.confirm('Clear all bingo checks?')) return;
    clearBingo();
    setChecked(new Set());
    notifyBingoUpdate();
  };

  const byRegion = ['boston', 'harbor', 'any'] as const;

  return (
    <>
      <HeroBanner
        title="Trip Bingo"
        subtitle="Check off tastes & moments · saved on this phone"
        image={CITY_IMAGES.food}
        theme="food"
        badge={complete ? 'Blackout!' : `${count} / ${total}`}
      />

      <div className="card trip-bingo-progress-card">
        <p className="trip-bingo-progress-text">
          {complete
            ? 'You cleared the board — wicked pissah trip!'
            : count === 0
              ? 'Start checking boxes as you go.'
              : `${count} of ${total} — keep exploring!`}
        </p>
        <div className="trip-bingo-progress-bar" aria-hidden>
          <span
            className="trip-bingo-progress-fill"
            style={{ width: `${total ? (count / total) * 100 : 0}%` }}
          />
        </div>
        {count > 0 && (
          <button type="button" className="btn trip-bingo-reset" onClick={handleReset}>
            Reset board
          </button>
        )}
      </div>

      {byRegion.map((region) => {
        const items = TRIP_BINGO_ITEMS.filter((i) => i.region === region);
        return (
          <div key={region} className="card">
            <h2>{REGION_LABEL[region]}</h2>
            <ul className="trip-bingo-grid">
              {items.map((item) => {
                const isChecked = checked.has(item.id);
                const mapUrl = bingoMapUrl(item);
                const hasMap = bingoHasMap(item);
                return (
                  <li key={item.id} className="trip-bingo-row">
                    <button
                      type="button"
                      className={`trip-bingo-cell${isChecked ? ' trip-bingo-cell-checked' : ''}${hasMap ? ' trip-bingo-cell-with-map' : ''}`}
                      onClick={() => handleToggle(item.id)}
                      aria-pressed={isChecked}
                    >
                      <span className="trip-bingo-emoji">{item.emoji}</span>
                      <span className="trip-bingo-label">{item.label}</span>
                      {isChecked && <span className="trip-bingo-check">✓</span>}
                    </button>
                    {mapUrl && (
                      <button
                        type="button"
                        className="btn btn-map trip-bingo-map-btn"
                        aria-label={`Map: ${item.label}`}
                        onClick={() => openUrl(mapUrl)}
                      >
                        📍
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}
