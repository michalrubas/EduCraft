const APP_CACHE_ASSETS = [
  '/manifest.webmanifest',
  '/icons/app-icon.svg',
  '/icons/app-icon-maskable.svg',
];

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const readyRegistration = await navigator.serviceWorker.ready;
      const activeWorker =
        readyRegistration.active ??
        registration.active ??
        readyRegistration.waiting ??
        registration.waiting;

      if (!activeWorker) {
        return;
      }

      const resourceUrls = performance
        .getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((url) => url.startsWith(window.location.origin));

      activeWorker.postMessage({
        type: 'CACHE_URLS',
        payload: Array.from(
          new Set([
            window.location.href,
            `${window.location.origin}/`,
            `${window.location.origin}/index.html`,
            ...APP_CACHE_ASSETS.map((path) => `${window.location.origin}${path}`),
            ...resourceUrls,
          ]),
        ),
      });
    } catch (error) {
      console.error('Service worker registration failed', error);
    }
  });
}
