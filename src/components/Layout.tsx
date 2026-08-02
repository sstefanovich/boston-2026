import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { IconSprite } from './IconSprite';
import { NavIcon } from './NavIcon';
import { PullToRefresh } from './PullToRefresh';
import { AndroidBackHandler } from './AndroidBackHandler';
import { ScrollToTop } from './ScrollToTop';
import { ThemeToggle } from './ThemeToggle';
import { APP_TITLE, NAV_SECTIONS } from '../data/content';
import { scrollAppToTop } from '../utils/scrollToTop';

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest('a[href]');
      if (!anchor || !root.contains(anchor)) return;
      const href = anchor.getAttribute('href') ?? '';
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

      <div
        className={`drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />
      <nav className={`drawer${drawerOpen ? ' open' : ''}`} aria-label="All sections" aria-hidden={!drawerOpen}>
        <div className="drawer-header">
          <div>
            <p className="drawer-kicker">Menu</p>
            <h2>{APP_TITLE}</h2>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="drawer-links">
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
              <span className="drawer-link-icon" aria-hidden>
                <NavIcon name={s.icon} size={18} />
              </span>
              {s.label}
            </NavLink>
          ))}
        </div>
        <div className="drawer-theme">
          <h3>Appearance</h3>
          <ThemeToggle compact />
        </div>
      </nav>

      <header className="top-bar">
        <button
          type="button"
          className="top-bar-menu"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <NavIcon name="menu" size={22} />
        </button>
        <Link to="/" className="top-bar-brand" onClick={() => scrollAppToTop()}>
          {APP_TITLE}
        </Link>
        <Link
          to="/calendar"
          className="top-bar-action"
          onClick={() => scrollAppToTop()}
          aria-label="Calendar"
        >
          <NavIcon name="calendar" size={20} />
        </Link>
      </header>

      <div className="app-shell">
        <main className="page">
          <Outlet />
        </main>
      </div>
    </>
  );
}
