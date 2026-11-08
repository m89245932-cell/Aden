import React from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';
import { useLanguage } from '../context/LanguageContext';
import { Business } from '../types/index';
import {
  GOOGLE_MAPS_API_KEY,
  GMP_ATTRIBUTION_ID
} from '../services/mapsConfig';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface BusinessLocationMapProps {
  business: Business;
  height?: string;
}

export const BusinessLocationMap: React.FC<BusinessLocationMapProps> = ({
  business,
  height = '320px'
}) => {
  const { lang, t } = useLanguage();

  const hasCoords = typeof business.lat === 'number' && typeof business.lng === 'number';
  const position = hasCoords
    ? { lat: business.lat!, lng: business.lng! }
    : { lat: 12.8000, lng: 45.0100 };

  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${business.name} Aden Yemen`
      )}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'الموقع الجغرافي على خريطة عدن' : 'Geographic Location'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar' ? business.addressAr : business.address}
          </p>
        </div>

        {/* Directions CTA */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-transform active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'الاتجاهات عبر Google Maps' : 'Get Directions'}</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>

      {/* Map Embed */}
      <div
        style={{ width: '100%', height }}
        className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner"
      >
        <APIProvider
          apiKey={GOOGLE_MAPS_API_KEY}
          language={lang === 'ar' ? 'ar' : 'en'}
          region="YE"
        >
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={position}
            defaultZoom={15}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            internalUsageAttributionIds={[GMP_ATTRIBUTION_ID]}
            style={{ width: '100%', height: '100%' }}
          >
            {hasCoords && (
              <AdvancedMarker position={position} title={lang === 'ar' ? business.nameAr : business.name}>
                <Pin
                  background="#0284c7"
                  glyphColor="#ffffff"
                  borderColor="#0369a1"
                  scale={1.2}
                />
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Coordinates pill */}
      {hasCoords && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>
            {lang === 'ar' ? 'إحداثيات GPS:' : 'GPS Coordinates:'} {business.lat?.toFixed(4)}, {business.lng?.toFixed(4)}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            ● {lang === 'ar' ? 'موقع دقيق ومؤكد' : 'Verified Location'}
          </span>
        </div>
      )}

    </div>
  );
};
