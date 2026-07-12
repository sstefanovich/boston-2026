import type { Place } from '../data/content';
import { getWalkHintForPlace } from '../data/walkTimes';

interface WalkHintProps {
  place: Place;
}

export function WalkHint({ place }: WalkHintProps) {
  const hint = getWalkHintForPlace(place);
  if (!hint) return null;
  return <p className="place-walk-hint">🚶 {hint}</p>;
}
