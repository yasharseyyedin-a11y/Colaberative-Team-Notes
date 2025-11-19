import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersCollection;

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  async updateUserData(uid: string, email: string): Promise<void> {
    console.log("updateUserData");
    if (!uid) {
      console.warn('No UID provided, skipping updateUserData');
      return;
    }
    console.log("Read Doc");
    const userDoc = doc(this.firestore, `users/${uid}`);
    console.log("Success");

    try {
      // setDoc with { merge: true } creates or updates the document safely
    console.log("Set Doc");
      await setDoc(
        userDoc,
        {
          uid,
          email,
          // add more user properties if needed
        },
        { merge: true }
      );
      console.log('User data successfully updated for UID:', uid);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }

  async getUidByEmail(email: string): Promise<string | null> {
    try {
      const q = query(this.usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // the document id is typically the UID
        return querySnapshot.docs[0].id;
      }
      return null;
    } catch (error) {
      console.error('Error fetching UID by email:', error);
      return null;
    }
  }
}
