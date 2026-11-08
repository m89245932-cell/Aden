import React, { useEffect } from 'react';
import { Business } from '../types/index';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  business?: Business | null;
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({ title, description, business }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | AdenGo عدن جو`;
    }
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      }
    }
  }, [title, description]);

  if (!business) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    alternateName: business.nameAr,
    image: business.image,
    telephone: business.phone,
    priceRange: business.priceLevel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.district,
      addressRegion: 'Aden Governorate',
      addressCountry: 'YE'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewsCount
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
