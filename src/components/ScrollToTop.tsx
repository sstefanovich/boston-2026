import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollAppToTop } from '../utils/scrollToTop';

/** Scroll to top on every navigation. */
export function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    const run = () => {
      const page = document.querySelector<HTMLElement>('.page');
      scrollAppToTop(page);
    };

    run();
    const id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.search, location.hash, location.key]);

  return null;
}
