import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * Retries a dynamic import up to `retries` times with exponential backoff.
 * If all retries fail and it's a chunk loading / network error, it will perform
 * a single page reload to fetch the latest application bundle.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries: number = 3,
  interval: number = 1000
): LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (attemptsLeft: number) => {
        componentImport()
          .then(resolve)
          .catch((error: Error) => {
            const isChunkError =
              error?.message?.includes('Failed to fetch dynamically imported module') ||
              error?.message?.includes('Importing a module script failed') ||
              error?.name === 'ChunkLoadError';

            if (attemptsLeft <= 1) {
              // Check if we haven't already reloaded in this session to prevent infinite reload loops
              const storageKey = `retry_reload_${window.location.pathname}`;
              const hasReloaded = sessionStorage.getItem(storageKey);

              if (isChunkError && !hasReloaded) {
                sessionStorage.setItem(storageKey, 'true');
                window.location.reload();
                return;
              }

              reject(error);
              return;
            }

            setTimeout(() => {
              attempt(attemptsLeft - 1);
            }, interval);
          });
      };

      attempt(retries);
    });
  });
}
