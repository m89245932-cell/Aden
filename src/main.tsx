import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Google Maps Platform Tier 1 Quota Defense
// Intercepts over-quota and auth errors from GMP script and broadcasts an event to the UI
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('OverQuotaMapError') ||
      msg.includes('BillingNotEnabledMapError') ||
      msg.includes('ApiNotActivatedMapError') ||
      msg.includes('InvalidKeyMapError')
    ) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
