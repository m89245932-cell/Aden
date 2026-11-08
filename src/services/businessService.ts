import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Business, Review } from '../types/index';
import { INITIAL_BUSINESSES, INITIAL_REVIEWS } from '../data/seedData';
import { calculateAverageRating } from '../utils/directoryLogic';

const BUSINESSES_COLLECTION = 'businesses';

export async function fetchBusinesses(): Promise<Business[]> {
  try {
    const colRef = collection(db, BUSINESSES_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      // Bootstrap with initial seed data so the database is immediately populated
      const businesses: Business[] = [...INITIAL_BUSINESSES];
      for (const b of businesses) {
        try {
          await setDoc(doc(db, BUSINESSES_COLLECTION, b.id), b);
        } catch {
          // If write fails, proceed with in-memory seed
        }
      }
      return businesses;
    }

    const items: Business[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Business;
      // Backfill coordinates if existing document lacks them
      if (!data.lat || !data.lng) {
        const seedMatch = INITIAL_BUSINESSES.find((ib) => ib.id === data.id);
        if (seedMatch) {
          data.lat = seedMatch.lat;
          data.lng = seedMatch.lng;
        }
      }
      items.push(data);
    });
    return items;
  } catch (error) {
    console.warn('Falling back to local seed data due to:', error);
    // Return seed data so the UI remains 100% interactive and resilient
    return INITIAL_BUSINESSES;
  }
}

export async function createBusiness(business: Business): Promise<void> {
  const path = `${BUSINESSES_COLLECTION}/${business.id}`;
  try {
    await setDoc(doc(db, BUSINESSES_COLLECTION, business.id), {
      ...business,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<void> {
  const path = `${BUSINESSES_COLLECTION}/${id}`;
  try {
    await updateDoc(doc(db, BUSINESSES_COLLECTION, id), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteBusiness(id: string): Promise<void> {
  const path = `${BUSINESSES_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, BUSINESSES_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function recordLead(businessId: string): Promise<void> {
  const path = `${BUSINESSES_COLLECTION}/${businessId}`;
  try {
    await updateDoc(doc(db, BUSINESSES_COLLECTION, businessId), {
      leads: increment(1)
    });
  } catch (error) {
    // Non-blocking counter increment
    console.warn('Could not increment lead counter in Firestore:', error);
  }
}

export async function recordView(businessId: string): Promise<void> {
  const path = `${BUSINESSES_COLLECTION}/${businessId}`;
  try {
    await updateDoc(doc(db, BUSINESSES_COLLECTION, businessId), {
      views: increment(1)
    });
  } catch (error) {
    console.warn('Could not increment view counter in Firestore:', error);
  }
}

export async function fetchReviews(businessId: string): Promise<Review[]> {
  const path = `${BUSINESSES_COLLECTION}/${businessId}/reviews`;
  try {
    const reviewsRef = collection(db, BUSINESSES_COLLECTION, businessId, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    if (snap.empty) {
      // Filter initial mock reviews
      return INITIAL_REVIEWS.filter(r => r.businessId === businessId);
    }

    const reviews: Review[] = [];
    snap.forEach((d) => {
      reviews.push(d.data() as Review);
    });
    return reviews;
  } catch (error) {
    console.warn('Falling back to local reviews for', businessId);
    return INITIAL_REVIEWS.filter(r => r.businessId === businessId);
  }
}

export async function addReview(businessId: string, review: Review, existingReviews: Review[]): Promise<void> {
  const path = `${BUSINESSES_COLLECTION}/${businessId}/reviews/${review.id}`;
  try {
    const reviewRef = doc(db, BUSINESSES_COLLECTION, businessId, 'reviews', review.id);
    await setDoc(reviewRef, review);

    // Calculate new average rating and update business doc
    const updatedReviews = [review, ...existingReviews];
    const { average, count } = calculateAverageRating(updatedReviews);

    await updateDoc(doc(db, BUSINESSES_COLLECTION, businessId), {
      rating: average,
      reviewsCount: count
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
