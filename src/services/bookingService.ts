import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Booking, BookingStatus } from '../types/index';
import { INITIAL_BOOKINGS } from '../data/seedData';

const BOOKINGS_COLLECTION = 'bookings';
const LOCAL_STORAGE_KEY = 'adengo_bookings_cache';

// Helper to get local cache
function getCachedBookings(): Booking[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignore JSON errors
  }
  return [...INITIAL_BOOKINGS];
}

// Helper to save local cache
function saveCachedBookings(bookings: Booking[]): void {
  try {
    const cacheSafeBookings = bookings.map((booking) => ({
      ...booking,
      customerPhone: ''
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cacheSafeBookings));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Fetch all bookings for a given business ID (for merchant dashboard)
 */
export async function fetchMerchantBookings(businessIds: string[]): Promise<Booking[]> {
  try {
    const colRef = collection(db, BOOKINGS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const cached = getCachedBookings();
      return cached.filter((b) => businessIds.includes(b.businessId));
    }

    const items: Booking[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Booking;
      if (businessIds.includes(data.businessId)) {
        items.push(data);
      }
    });

    if (items.length === 0) {
      const cached = getCachedBookings();
      return cached.filter((b) => businessIds.includes(b.businessId));
    }

    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Falling back to cached bookings for merchant:', error);
    const cached = getCachedBookings();
    return cached.filter((b) => businessIds.includes(b.businessId));
  }
}

/**
 * Fetch all bookings made by a specific customer / user
 */
export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  try {
    const colRef = collection(db, BOOKINGS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const cached = getCachedBookings();
      return cached.filter((b) => b.userId === userId);
    }

    const items: Booking[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Booking;
      if (data.userId === userId) {
        items.push(data);
      }
    });

    if (items.length === 0) {
      const cached = getCachedBookings();
      return cached.filter((b) => b.userId === userId);
    }

    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Falling back to cached bookings for user:', error);
    const cached = getCachedBookings();
    return cached.filter((b) => b.userId === userId);
  }
}

/**
 * Create a new customer booking request
 */
export async function createBooking(booking: Booking): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${booking.id}`;
  
  // Update local cache first for instant UI response
  const cached = getCachedBookings();
  const updatedCache = [booking, ...cached.filter((b) => b.id !== booking.id)];
  saveCachedBookings(updatedCache);

  try {
    await setDoc(doc(db, BOOKINGS_COLLECTION, booking.id), {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore booking write notice:', error);
    // Local cache already preserved
  }
}

/**
 * Update the status of a booking (confirm, decline, cancel)
 */
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  merchantNotes?: string
): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;

  // Update local cache
  const cached = getCachedBookings();
  const updatedCache = cached.map((b) =>
    b.id === bookingId
      ? {
          ...b,
          status,
          merchantNotes: merchantNotes !== undefined ? merchantNotes : b.merchantNotes,
          updatedAt: new Date().toISOString()
        }
      : b
  );
  saveCachedBookings(updatedCache);

  try {
    const updates: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (merchantNotes !== undefined) {
      updates.merchantNotes = merchantNotes;
    }
    await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), updates);
  } catch (error) {
    console.warn('Firestore booking update notice:', error);
  }
}
