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
  gallery?: string[];
  description: string;
  descriptionAr: string;
  hoursEn: string;
  hoursAr: string;
  ownerId: string;
  views: number;
  leads: number;
  lat?: number;
  lng?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  businessId: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  comment: string;
  userId: string;
  createdAt: string;
}

export interface District {
  id: string;
  en: string;
  ar: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

export interface Category {
  id: string;
  icon: string;
  en: string;
  ar: string;
  count?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'merchant' | 'admin';
  createdAt?: string;
}

export interface PricingPlan {
  id: string;
  nameEn: string;
  nameAr: string;
  priceYer: string;
  priceUsd: string;
  periodEn: string;
  periodAr: string;
  popular?: boolean;
  featuresEn: string[];
  featuresAr: string[];
  ctaEn: string;
  ctaAr: string;
}
