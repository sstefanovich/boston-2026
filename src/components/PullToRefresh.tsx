import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefresh } from '../context/RefreshContext';

const PULL_THRESHOLD = 72;
const MAX_PULL = 100;

function scrollAtTop(): boolean {
  return (
    window.scrollY <= 2 &&
    document.documentElement.scrollTop <= 2 &&
    document.body.scrollTop <= 2
  );
}

export function PullToRefresh() {
  const { refreshing, triggerRefresh } = useRefresh();
  const [pull, setPull] = useState(0);
  const startY = useRef(0);
  const pulling = useRef(false);
  const busy = useRef(false);

  const handleRefresh = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      await triggerRefresh();
    } finally {
      busy.current = false;
      setPull(0);
      pulling.current = false;
    }
  }, [triggerRefresh]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (refreshing || !scrollAtTop()) {
        pulling.current = false;
        return;
      }
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current || refreshing) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0 && scrollAtTop()) {
        setPull(Math.min(dy * 0.45, MAX_PULL));
        if (dy > 10) e.preventDefault();
      } else {
        setPull(0);
        pulling.current = false;
      }
    };

    const onTouchEnd = () => {
      if (!pulling.current) return;
      const shouldRefresh = pull >= PULL_THRESHOLD;
      pulling.current = false;
      if (shouldRefresh) {
        setPull(PULL_THRESHOLD);
        void handleRefresh();
      } else {
        setPull(0);
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [pull, refreshing, handleRefresh]);

  const visible = pull > 4 || refreshing;
  const progress = refreshing ? 1 : Math.min(pull / PULL_THRESHOLD, 1);

  return (
    <div
      className={`ptr-indicator${visible ? ' ptr-indicator-visible' : ''}${refreshing ? ' ptr-indicator-busy' : ''}`}
      style={{ height: visible ? `${Math.max(pull, refreshing ? 48 : 0)}px` : 0 }}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="ptr-indicator-inner" style={{ opacity: 0.4 + progress * 0.6 }}>
        <span className="ptr-spinner" aria-hidden />
        <span>{refreshing ? 'Refreshing…' : progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}</span>
      </div>
    </div>
  );
}
