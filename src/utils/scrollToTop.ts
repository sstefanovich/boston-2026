/** Reset scroll after route changes (main panel + document fallbacks). */
export function scrollAppToTop(scrollRoot?: HTMLElement | null): void {
  if (scrollRoot) {
    scrollRoot.scrollTop = 0;
    scrollRoot.scrollLeft = 0;
  }
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function disableBrowserScrollRestoration(): void {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}
