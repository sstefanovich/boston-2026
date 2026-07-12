import { useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { TRIP_BINGO_ITEMS } from '../data/tripBingo';
import { getBingoChecked } from '../utils/tripBingoStorage';

function subscribeBingo(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener('storage', handler);
  window.addEventListener('fb-bingo-update', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('fb-bingo-update', handler);
  };
}

function getBingoSnapshot() {
  return getBingoChecked().size;
}

export function notifyBingoUpdate() {
  window.dispatchEvent(new Event('fb-bingo-update'));
}

export function TripBingoHomeCard() {
  const checked = useSyncExternalStore(subscribeBingo, getBingoSnapshot, () => 0);
  const total = TRIP_BINGO_ITEMS.length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <Link to="/bingo" className="card trip-bingo-home-card">
      <div className="trip-bingo-home-head">
        <h2>🎯 Trip bingo</h2>
        <span className="trip-bingo-home-score">
          {checked}/{total}
        </span>
      </div>
      <div className="trip-bingo-home-bar" aria-hidden>
        <span className="trip-bingo-home-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="trip-bingo-home-lead">Tap squares as you eat, drink, and explore →</p>
    </Link>
  );
}
