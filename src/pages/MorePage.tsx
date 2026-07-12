import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { NavIcon } from '../components/NavIcon';
import { ThemeToggle } from '../components/ThemeToggle';
import { CITY_IMAGES, ICON_CHECKLIST, NAV_SECTIONS, USEFUL_LINKS } from '../data/content';
import { openUrl } from '../utils/links';

export function MorePage() {
  return (
    <>
      <HeroBanner title="More" subtitle="Food · transit · links" image={CITY_IMAGES.food} theme="food" />
      <div className="card">
        <h2>Appearance</h2>
        <ThemeToggle />
      </div>
      <div className="card">
        <h2>All sections</h2>
        {NAV_SECTIONS.map((s) => (
          <Link key={s.id} to={s.path} className="btn nav-link-btn">
            <NavIcon name={s.icon} size={20} /> {s.label}
          </Link>
        ))}
      </div>
      <div className="card">
        <h2>Icon checklist</h2>
        {Object.entries(ICON_CHECKLIST).map(([city, items]) => (
          <div key={city} style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ textTransform: 'capitalize' }}>{city}</h3>
            <ul>
              {items.map((i) => (
                <li key={i}>
                  <label className="check-item">
                    <input type="checkbox" />
                    {i}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Food highlights</h2>
        <h3>Must-try</h3>
        <ul>
          <li>New England clam chowder, lobster roll, fried clams</li>
          <li>North End: cannoli, arancini, red-sauce pasta</li>
          <li>Sam Adams, Harpoon, or a local craft IPA</li>
          <li>Boston cream pie (yes, it&apos;s cake)</li>
        </ul>
      </div>
      <div className="card">
        <h2>Useful links</h2>
        {USEFUL_LINKS.map((l) => (
          <button key={l.url} type="button" className="btn" style={{ display: 'block', width: '100%', marginBottom: '0.4rem', textAlign: 'left' }} onClick={() => openUrl(l.url)}>
            🔗 {l.label}
          </button>
        ))}
      </div>
      <div className="card">
        <h2>Transit cheat sheet</h2>
        <ul>
          <li>The T: Red, Orange, Green, Blue lines + buses</li>
          <li>CharlieCard or tap credit card at fare gates</li>
          <li>Logan: Silver Line SL1 free inbound to South Station</li>
          <li>Cambridge: Red Line to Harvard or Kendall/MIT</li>
          <li>Fenway: Green Line to Kenmore</li>
        </ul>
      </div>
    </>
  );
}
