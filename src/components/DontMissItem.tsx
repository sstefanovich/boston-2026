import type { DontMissEntry } from '../data/content';
import { AddressBlock } from './AddressBlock';
import { mapsSearchUrl, openUrl } from '../utils/links';

interface DontMissItemProps {
  item: DontMissEntry;
}

export function DontMissItemRow({ item }: DontMissItemProps) {
  const mapTarget = item.mapQuery ?? item.address;

  return (
    <li className="dont-miss-item">
      <div className="dont-miss-body">
        <span className="dont-miss-text">{item.text}</span>
        <AddressBlock address={item.address} />
      </div>
      {mapTarget && (
        <button
          type="button"
          className="btn btn-map btn-compact"
          onClick={() => openUrl(mapsSearchUrl(mapTarget))}
          aria-label={`Map: ${item.text}`}
        >
          📍
        </button>
      )}
    </li>
  );
}
