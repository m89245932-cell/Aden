import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { useLanguage } from '../context/LanguageContext';
import { Business } from '../types/index';
import { ADEN_DISTRICTS, CATEGORIES } from '../data/seedData';
import {
  GOOGLE_MAPS_API_KEY,
  ADEN_DEFAULT_CENTER,
  ADEN_DEFAULT_ZOOM,
  GMP_ATTRIBUTION_ID
} from '../services/mapsConfig';
import {
  MapPin,
  Star,
  MessageCircle,
  ExternalLink,
  Navigation,
  Compass,
  CheckCircle,
  Maximize2
} from 'lucide-react';

interface AdenCityMapProps {
  businesses: Business[];
  selectedDistrict?: string;
  onDistrictChange?: (districtId: string) => void;
  selectedCategory?: string;
  highlightedBusinessId?: string;
  onSelectBusiness?: (b: Business) => void;
  onOpenInquiry?: (b: Business) => void;
  height?: string;
  showDistrictPills?: boolean;
}

// Controller component to smoothly pan and zoom the map
function MapCenterController({
  selectedDistrict,
  highlightedBusiness
}: {
  selectedDistrict?: string;
  highlightedBusiness?: Business;
}) {
  const mapInstance = useMap();

  useEffect(() => {
    if (!mapInstance) return;

    if (highlightedBusiness && highlightedBusiness.lat && highlightedBusiness.lng) {
      mapInstance.panTo({
        lat: highlightedBusiness.lat,
        lng: highlightedBusiness.lng
      });
      mapInstance.setZoom(15);
      return;
    }

    if (selectedDistrict && selectedDistrict !== 'all') {
      const dist = ADEN_DISTRICTS.find((d) => d.id === selectedDistrict);
      if (dist && dist.lat && dist.lng) {
        mapInstance.panTo({ lat: dist.lat, lng: dist.lng });
        mapInstance.setZoom(dist.zoom || 14);
        return;
      }
    }

    // Default center on Aden harbor / peninsula
    mapInstance.panTo(ADEN_DEFAULT_CENTER);
    mapInstance.setZoom(ADEN_DEFAULT_ZOOM);
  }, [mapInstance, selectedDistrict, highlightedBusiness]);

  return null;
}

export const AdenCityMap: React.FC<AdenCityMapProps> = ({
  businesses,
  selectedDistrict = 'all',
  onDistrictChange,
  selectedCategory = 'all',
  highlightedBusinessId,
  onSelectBusiness,
  onOpenInquiry,
  height = '500px',
  showDistrictPills = true
}) => {
  const { lang, t } = useLanguage();
  const [selectedMarker, setSelectedMarker] = useState<Business | null>(null);

  // Filter businesses that have valid coordinates
  const validBusinesses = businesses.filter(
    (b) => typeof b.lat === 'number' && typeof b.lng === 'number'
  );

  const highlightedBiz = validBusinesses.find((b) => b.id === highlightedBusinessId);

  // Auto-select info window when highlighted business changes
  useEffect(() => {
    if (highlightedBiz) {
      setSelectedMarker(highlightedBiz);
    }
  }, [highlightedBiz]);

  // Color generator based on category
  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'restaurants':
        return { background: '#ea580c', glyph: '#ffffff', border: '#c2410c' }; // Coral/Tandoor
      case 'cafes':
        return { background: '#92400e', glyph: '#fef3c7', border: '#78350f' }; // Artisan Coffee
      case 'hotels':
        return { background: '#0284c7', glyph: '#ffffff', border: '#0369a1' }; // Nautical Sky
      case 'shopping':
        return { background: '#7c3aed', glyph: '#ffffff', border: '#6d28d9' }; // Violet Tech
      case 'clinics':
        return { background: '#059669', glyph: '#ffffff', border: '#047857' }; // Emerald Care
      default:
        return { background: '#0369a1', glyph: '#ffffff', border: '#075985' }; // Aden Blue
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-sky-100 dark:border-slate-800 shadow-xl bg-slate-900">
      
      {/* Top Map Filter Controls & District Navigator */}
      {showDistrictPills && (
        <div className="absolute top-4 inset-x-4 z-10 flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-200/50 dark:border-slate-700/60 shadow-lg">
          <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sky-700 dark:text-sky-300">
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === 'ar' ? 'مديريات عدن:' : 'Aden Districts:'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {ADEN_DISTRICTS.map((dist) => {
              const active = selectedDistrict === dist.id;
              return (
                <button
                  key={dist.id}
                  onClick={() => onDistrictChange?.(dist.id)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    active
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {lang === 'ar' ? dist.ar : dist.en}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div style={{ width: '100%', height }} className="relative">
        <APIProvider
          apiKey={GOOGLE_MAPS_API_KEY}
          language={lang === 'ar' ? 'ar' : 'en'}
          region="YE"
        >
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={ADEN_DEFAULT_CENTER}
            defaultZoom={ADEN_DEFAULT_ZOOM}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={[GMP_ATTRIBUTION_ID]}
            style={{ width: '100%', height: '100%' }}
          >
            <MapCenterController
              selectedDistrict={selectedDistrict}
              highlightedBusiness={highlightedBiz}
            />

            {validBusinesses.map((b) => {
              const colors = getMarkerColor(b.category);
              const isSelected = selectedMarker?.id === b.id;

              return (
                <AdvancedMarker
                  key={b.id}
                  position={{ lat: b.lat!, lng: b.lng! }}
                  onClick={() => setSelectedMarker(b)}
                  title={lang === 'ar' ? b.nameAr : b.name}
                  zIndex={isSelected ? 100 : 1}
                >
                  <Pin
                    background={isSelected ? '#0284c7' : colors.background}
                    glyphColor={colors.glyph}
                    borderColor={colors.border}
                    scale={isSelected ? 1.25 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for Selected Business */}
            {selectedMarker && selectedMarker.lat && selectedMarker.lng && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
                pixelOffset={[0, -32]}
              >
                <div
                  className="p-1 max-w-[260px] text-slate-800 font-sans"
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2">
                    <img
                      src={selectedMarker.image}
                      alt={selectedMarker.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 rtl:left-2 ltr:right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-600 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{selectedMarker.rating}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug">
                    {lang === 'ar' ? selectedMarker.nameAr : selectedMarker.name}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                    <span className="truncate">
                      {lang === 'ar' ? selectedMarker.addressAr : selectedMarker.address}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onSelectBusiness?.(selectedMarker);
                        setSelectedMarker(null);
                      }}
                      className="flex-1 py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold rounded-lg transition text-center"
                    >
                      {lang === 'ar' ? 'التفاصيل' : 'Details'}
                    </button>

                    <button
                      onClick={() => {
                        onOpenInquiry?.(selectedMarker);
                        setSelectedMarker(null);
                      }}
                      className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition text-center flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Map Legend Overlay at Bottom Right */}
      <div className="absolute bottom-3 rtl:left-3 ltr:right-3 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-md">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
          <span>{lang === 'ar' ? 'مطاعم ومأكولات' : 'Food'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
          <span>{lang === 'ar' ? 'فنادق' : 'Hotels'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
          <span>{lang === 'ar' ? 'مقاهي' : 'Cafes'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>{lang === 'ar' ? 'عيادات' : 'Clinics'}</span>
        </span>
      </div>

    </div>
  );
};
