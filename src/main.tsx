import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { disableBrowserScrollRestoration } from './utils/scrollToTop';
import { bootstrapTheme } from './utils/theme';
import 'leaflet/dist/leaflet.css';
import './index.css';

disableBrowserScrollRestoration();
bootstrapTheme();

const rootEl = document.getElementById('root');

if (!rootEl) {
  document.body.innerHTML =
    '<p style="padding:1rem;font-family:sans-serif;">App failed to start: missing #root</p>';
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    rootEl.innerHTML = `<p style="padding:1rem;color:#c00;font-family:sans-serif;">Error: ${msg}</p>`;
    console.error(err);
  }
}
