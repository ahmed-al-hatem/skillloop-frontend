import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { env } from '@/config/env';
import '@/styles/index.css';

/** Start MSW before the first render, only when VITE_USE_MOCKS=true. */
async function enableMocking() {
  if (!env.USE_MOCKS) return;
  const { worker } = await import('@/mocks/browser');
  // Requests without a handler go to the real API (MSW 3 name for `onUnhandledRequest`).
  await worker.start({ onUnhandledFrame: 'bypass' });
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
