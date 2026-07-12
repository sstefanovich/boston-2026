import { HeroBanner } from '../components/HeroBanner';
import { CITY_IMAGES, EMERGENCY } from '../data/content';
import { openUrl, telUrl } from '../utils/links';

export function EmergencyPage() {
  return (
    <>
      <HeroBanner title="Emergency" subtitle="911 · US emergency services" image={CITY_IMAGES.travel} theme="travel" />
      {EMERGENCY.map((e) => (
        <div key={e.label} className="card">
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>{e.label}</h3>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>{e.value}</p>
          <button type="button" className="btn btn-primary" onClick={() => openUrl(telUrl(e.tel))}>
            📞 Call
          </button>
        </div>
      ))}
    </>
  );
}
