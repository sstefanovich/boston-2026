import { HeroBanner } from '../components/HeroBanner';
import { CITY_IMAGES, TRAVEL_APPS } from '../data/content';
import { openUrl, playStoreUrl } from '../utils/links';

export function SetupPage() {
  return (
    <>
      <HeroBanner
        title="Before You Go"
        subtitle="Logan · MBTA · North End reservations"
        image={CITY_IMAGES.travel}
        theme="travel"
      />
      <div className="card">
        <h2>Flights</h2>
        <ul>
          <li>
            <strong>Sat 8 Aug — UA1117</strong> Chicago (ORD) 9:20 AM → Boston (BOS) <strong>12:47 PM</strong> · United Economy (L)
          </li>
          <li>
            <strong>Wed 12 Aug — UA1732</strong> Boston (BOS) <strong>12:20 PM</strong> → Chicago (ORD) 2:07 PM · United Economy (K)
          </li>
        </ul>
        <p className="page-lead" style={{ marginTop: '0.65rem', marginBottom: 0 }}>
          Wed departure is tight with noon checkout — leave for Logan around 10:30 AM.
        </p>
      </div>
      <div className="card">
        <h2>Getting there</h2>
        <ul>
          <li>Logan (BOS): Silver Line SL1 to South Station, taxi, or rideshare (~20–30 min downtown)</li>
          <li>Amtrak arrives South Station or Back Bay — both on the T</li>
          <li>Install the United app for boarding passes and gate updates</li>
        </ul>
      </div>
      <div className="card">
        <h2>Apps to install</h2>
        {TRAVEL_APPS.map((app) => (
          <div key={app.name} style={{ marginBottom: '0.85rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <strong>{app.name}</strong>
            {app.owners && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: '0.5rem' }}>{app.owners}</span>}
            <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>{app.why}</p>
            {app.packageId && (
              <button type="button" className="btn" style={{ marginTop: '0.4rem' }} onClick={() => openUrl(playStoreUrl(app.packageId!))}>
                Play Store →
              </button>
            )}
            {app.webUrl && !app.packageId && (
              <button type="button" className="btn" style={{ marginTop: '0.4rem' }} onClick={() => openUrl(app.webUrl!)}>
                Open →
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Pack & prep</h2>
        <ul>
          <li>Comfortable walking shoes — Boston is a walking city</li>
          <li>Light jacket — harbor breeze even in August</li>
          <li>CharlieCard or use contactless tap on the T ($2.40/ride)</li>
          <li>Book North End dinners early — weekends fill up</li>
        </ul>
      </div>
    </>
  );
}
