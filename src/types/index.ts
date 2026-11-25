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
  acceptsBookings?: boolean;
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
  phoneNumber?: string;
  district?: string;
  bio?: string;
  avatarUrl?: string;
  preferredLanguage?: 'ar' | 'en';
  role: 'user' | 'merchant' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled';

export interface Booking {
  id: string;
  businessId: string;
  businessName: string;
  businessNameAr: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "13:30" or "08:00 PM"
  guestsCount: number;
  specialRequests?: string;
  status: BookingStatus;
  merchantNotes?: string;
  createdAt: string;
  updatedAt?: string;
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
