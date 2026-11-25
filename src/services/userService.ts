import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types/index';

const USERS_COLLECTION = 'users';

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${userId}`;
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch user profile from Firestore:', error);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `${USERS_COLLECTION}/${profile.uid}`;
  try {
    await setDoc(doc(db, USERS_COLLECTION, profile.uid), {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Could not save user profile to Firestore:', error);
  }
}
