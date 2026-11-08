import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizePhoneNumber,
  formatWhatsAppUrl,
  calculateAverageRating,
  calculateConversionRate,
  validateBusinessInput,
  filterBusinesses,
  Business
} from './directoryLogic.js';

const mockList: Business[] = [
  {
    id: 'sira-fish',
    name: 'Sira Fishermen Port House',
    nameAr: 'مطعم مرسى صيرة للأسماك',
    category: 'restaurants',
    district: 'crater',
    address: 'Sira Bay, Crater, Aden',
    addressAr: 'خليج صيرة، كريتر، عدن',
    rating: 4.9,
    reviewsCount: 150,
    priceLevel: '$$',
    whatsapp: '+967 771 234 567',
    phone: '+967 2 250100',
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb',
    description: 'Fresh catch from Gulf of Aden grilled in traditional tandoor.',
    descriptionAr: 'صيد طازج من خليج عدن في أفران الموفى التقليدية.',
    hoursEn: '10 AM - 11 PM',
    hoursAr: '10 ص - 11 م',
    ownerId: 'owner-1',
    views: 1000,
    leads: 120
  },
  {
    id: 'mualla-cafe',
    name: 'Shamsan Heights Cafe',
    nameAr: 'كافيه قمم شمسان',
    category: 'cafes',
    district: 'mualla',
    address: 'Main Street, Mualla',
    addressAr: 'الشارع الرئيسي، المعلا',
    rating: 4.5,
    reviewsCount: 50,
    priceLevel: '$',
    whatsapp: '733987654',
    phone: '+967 2 240000',
    verified: false,
    featured: false,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
    description: 'Specialty Yemeni coffee with mountain view.',
    descriptionAr: 'بن يمني مختص مع إطلالة على الجبل.',
    hoursEn: '8 AM - Midnight',
    hoursAr: '8 ص - منتصف الليل',
    ownerId: 'owner-2',
    views: 500,
    leads: 25
  }
];

test('sanitizePhoneNumber formats yemeni numbers correctly', () => {
  assert.equal(sanitizePhoneNumber('+967 771 234 567'), '967771234567');
  assert.equal(sanitizePhoneNumber('733987654'), '967733987654');
  assert.equal(sanitizePhoneNumber('00967770111222'), '967770111222');
});

test('formatWhatsAppUrl constructs valid wa.me links with encoded inquiries', () => {
  const arabicUrl = formatWhatsAppUrl('+967 771 234 567', 'مرسى صيرة', 'ar');
  assert.match(arabicUrl, /^https:\/\/wa\.me\/967771234567\?text=/);
  assert.ok(arabicUrl.includes(encodeURIComponent('مرسى صيرة')));

  const englishUrl = formatWhatsAppUrl('733987654', 'Shamsan Cafe', 'en');
  assert.match(englishUrl, /^https:\/\/wa\.me\/967733987654\?text=/);
  assert.ok(englishUrl.includes('Shamsan%20Cafe'));
});

test('calculateAverageRating accurately calculates mean and count', () => {
  const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 5 }];
  const { average, count } = calculateAverageRating(reviews);
  assert.equal(average, 4.7);
  assert.equal(count, 3);

  assert.equal(calculateAverageRating([]).average, 5.0);
  assert.equal(calculateAverageRating([]).count, 0);
});

test('calculateConversionRate returns correct percentage', () => {
  assert.equal(calculateConversionRate(1000, 120), 12.0);
  assert.equal(calculateConversionRate(0, 10), 0);
});

test('validateBusinessInput verifies essential fields', () => {
  const invalid = validateBusinessInput({});
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 4);

  const valid = validateBusinessInput({
    name: 'Aden Marina',
    nameAr: 'مارينا عدن',
    category: 'hotels',
    district: 'tawahi',
    whatsapp: '777112233'
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);
});

test('filterBusinesses filters by district, category, and search query', () => {
  // District filter
  const craterOnly = filterBusinesses(mockList, { district: 'crater' });
  assert.equal(craterOnly.length, 1);
  assert.equal(craterOnly[0].id, 'sira-fish');

  // Search filter
  const searchResults = filterBusinesses(mockList, { search: 'شمسان' });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 'mualla-cafe');

  // Verified only
  const verifiedOnly = filterBusinesses(mockList, { verifiedOnly: true });
  assert.equal(verifiedOnly.length, 1);
  assert.equal(verifiedOnly[0].verified, true);
});
