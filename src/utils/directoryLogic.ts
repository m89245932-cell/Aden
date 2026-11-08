export interface Business {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  district: string;
  address: string;
  addressAr: string;
  rating: number;
  reviewsCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  whatsapp: string;
  phone: string;
  website?: string;
  verified: boolean;
  featured: boolean;
  image: string;
  description: string;
  descriptionAr: string;
  hoursEn: string;
  hoursAr: string;
  ownerId: string;
  views: number;
  leads: number;
  createdAt?: string;
  updatedAt?: string;
}

export const ADENGO_OFFICIAL_WHATSAPP = '967736739355';
export const ADENGO_OFFICIAL_PHONE_DISPLAY = '+967 736 739 355';

export interface FilterOptions {
  search?: string;
  district?: string;
  category?: string;
  priceLevel?: string;
  verifiedOnly?: boolean;
  sortBy?: 'recommended' | 'rating' | 'reviews' | 'views';
}

export function sanitizePhoneNumber(phone: string): string {
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  // If starts with 00967, strip 00
  if (cleaned.startsWith('00967')) {
    cleaned = cleaned.substring(2);
  }
  // If starts with 7 and length 9 (standard Yemen mobile without country code), prefix 967
  if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('0'))) {
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    cleaned = '967' + cleaned;
  }
  return cleaned;
}

export function formatWhatsAppUrl(phone: string, businessName: string, lang: 'ar' | 'en' = 'ar', customMessage?: string): string {
  const cleanPhone = sanitizePhoneNumber(phone);
  let defaultText = '';
  if (lang === 'ar') {
    defaultText = customMessage || `مرحباً، لقد وجدت متجركم "${businessName}" عبر منصة AdenGo (عدن جو) وأود الاستفسار عن خدماتكم والأسعار.`;
  } else {
    defaultText = customMessage || `Hello, I found your business "${businessName}" on AdenGo and would like to inquire about your services.`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;
}

export function calculateAverageRating(reviews: Array<{ rating: number }>): { average: number; count: number } {
  if (!reviews || reviews.length === 0) {
    return { average: 5.0, count: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const average = Number((sum / reviews.length).toFixed(1));
  return { average, count: reviews.length };
}

export function calculateConversionRate(views: number, leads: number): number {
  if (!views || views <= 0) return 0;
  return Number(((leads / views) * 100).toFixed(1));
}

export function validateBusinessInput(data: Partial<Business>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length < 2) {
    errors.push('English name must be at least 2 characters.');
  }
  if (!data.nameAr || data.nameAr.trim().length < 2) {
    errors.push('Arabic name must be at least 2 characters.');
  }
  if (!data.category) {
    errors.push('Category is required.');
  }
  if (!data.district) {
    errors.push('District is required.');
  }
  if (!data.whatsapp || data.whatsapp.trim().length < 7) {
    errors.push('A valid WhatsApp contact number is required.');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

export function filterBusinesses(businesses: Business[], options: FilterOptions): Business[] {
  const {
    search = '',
    district = 'all',
    category = 'all',
    priceLevel = 'all',
    verifiedOnly = false,
    sortBy = 'recommended'
  } = options;

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = businesses.filter((b) => {
    if (district !== 'all' && b.district !== district) {
      return false;
    }
    if (category !== 'all' && b.category !== category) {
      return false;
    }
    if (priceLevel !== 'all' && b.priceLevel !== priceLevel) {
      return false;
    }
    if (verifiedOnly && !b.verified) {
      return false;
    }
    if (normalizedSearch) {
      const matchName = b.name.toLowerCase().includes(normalizedSearch);
      const matchNameAr = b.nameAr.includes(normalizedSearch);
      const matchDesc = b.description.toLowerCase().includes(normalizedSearch);
      const matchDescAr = b.descriptionAr.includes(normalizedSearch);
      const matchAddress = b.address.toLowerCase().includes(normalizedSearch);
      const matchAddressAr = b.addressAr.includes(normalizedSearch);
      if (!matchName && !matchNameAr && !matchDesc && !matchDescAr && !matchAddress && !matchAddressAr) {
        return false;
      }
    }
    return true;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'reviews') {
      return b.reviewsCount - a.reviewsCount;
    }
    if (sortBy === 'views') {
      return b.views - a.views;
    }
    // 'recommended': featured first, then highest rating
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return b.rating - a.rating;
  });
}
