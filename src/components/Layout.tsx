import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { IconSprite } from './IconSprite';
import { NavIcon } from './NavIcon';
import { PullToRefresh } from './PullToRefresh';
import { AndroidBackHandler } from './AndroidBackHandler';
import { ScrollToTop } from './ScrollToTop';
import { ThemeToggle } from './ThemeToggle';
import { APP_TITLE, NAV_SECTIONS } from '../data/content';
import { scrollAppToTop } from '../utils/scrollToTop';

const BOTTOM_NAV = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/itinerary', icon: 'days', label: 'Days' },
  { path: '/places', icon: 'maps', label: 'Maps' },
  { path: '/journal', icon: 'journal', label: 'Journal' },
  { path: '/more', icon: 'menu', label: 'More', opensDrawer: true as const },
];

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest('a[href]');
      if (!anchor || !root.contains(anchor)) return;
      const href = anchor.getAttribute('href') ?? '';
      // In-app routes: HashRouter (#/path) or BrowserRouter (/path)
      if (href.startsWith('#/') || (href.startsWith('/') && !href.startsWith('//'))) {
        requestAnimationFrame(() => scrollAppToTop());
      }
    };

    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <IconSprite />
      <AndroidBackHandler drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
      <ScrollToTop />
      <PullToRefresh />
      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} aria-hidden />
          <nav className="drawer" aria-label="All sections">
            <h2>{APP_TITLE}</h2>
            {NAV_SECTIONS.map((s) => (
              <NavLink
                key={s.id}
                to={s.path}
                onClick={() => {
                  scrollAppToTop();
                  setDrawerOpen(false);
                }}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <NavIcon name={s.icon} size={20} /> {s.label}
              </NavLink>
            ))}
            <div className="drawer-theme">
              <h3>Appearance</h3>
              <ThemeToggle compact />
            </div>
          </nav>
        </>
      )}

      <div className="app-shell">
        <main className="page">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Main">
        {BOTTOM_NAV.map((item) =>
          item.opensDrawer ? (
            <button
              key={item.path}
              type="button"
              className={`bottom-nav-btn${drawerOpen || location.pathname === item.path ? ' active' : ''}`}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => scrollAppToTop()}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
    </>
  );
}
