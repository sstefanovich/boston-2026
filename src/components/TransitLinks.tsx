import type { TransitLink } from '../data/publicTransport';
import { openUrl } from '../utils/links';

interface TransitLinksProps {
  links: TransitLink[];
  title?: string;
}

export function TransitLinks({ links, title = 'Public transport' }: TransitLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="card transit-card">
      <h2>🚃 {title}</h2>
      <ul className="transit-list">
        {links.map((link) => (
          <li key={link.url}>
            <button type="button" className="btn btn-transit" onClick={() => openUrl(link.url)}>
              {link.label}
            </button>
            {link.note && <span className="transit-note">{link.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
