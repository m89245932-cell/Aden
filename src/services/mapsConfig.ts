import firebaseConfig from '../../firebase-applet-config.json';

// Google Maps Platform API key resolver
// 1. Environment variable VITE_GOOGLE_MAPS_API_KEY
// 2. Fallback to process.env.GOOGLE_MAPS_API_KEY
// 3. Fallback to firebaseConfig.apiKey (provisioned GHP key for the project)
export const GOOGLE_MAPS_API_KEY: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.GOOGLE_MAPS_API_KEY) ||
  firebaseConfig.apiKey ||
  '';

export const ADEN_DEFAULT_CENTER = {
  lat: 12.8000,
  lng: 45.0100
};

export const ADEN_DEFAULT_ZOOM = 12;

export const GMP_ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';
