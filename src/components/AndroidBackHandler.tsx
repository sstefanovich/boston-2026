import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface AndroidBackHandlerProps {
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

function closeTopOverlay(): boolean {
  const overlay = document.querySelector('.driver-overlay');
  if (!overlay) return false;
  const closeBtn = overlay.querySelector('.driver-overlay-close') as HTMLButtonElement | null;
  closeBtn?.click();
  return true;
}

function isAtAppHome(): boolean {
  const hash = window.location.hash || '#/';
  return hash === '#/' || hash === '' || hash === '#';
}

/** Hardware back on Android: overlay → drawer → previous route → exit */
export function AndroidBackHandler({ drawerOpen, onCloseDrawer }: AndroidBackHandlerProps) {
  const navigate = useNavigate();
  const drawerOpenRef = useRef(drawerOpen);
  drawerOpenRef.current = drawerOpen;

  const onCloseDrawerRef = useRef(onCloseDrawer);
  onCloseDrawerRef.current = onCloseDrawer;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let removeListener: (() => void) | undefined;

    void App.addListener('backButton', () => {
      if (closeTopOverlay()) return;

      if (drawerOpenRef.current) {
        onCloseDrawerRef.current();
        return;
      }

      if (!isAtAppHome()) {
        navigate(-1);
        return;
      }

      void App.exitApp();
    }).then((handle) => {
      removeListener = () => void handle.remove();
    });

    return () => {
      removeListener?.();
    };
  }, [navigate]);

  return null;
}
