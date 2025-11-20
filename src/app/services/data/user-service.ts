import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../user/auth-service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersCollection;
  firestore = inject(Firestore);
  authService = inject(AuthService);
  userId: string | null | undefined;
  email: string | null | undefined;

  constructor() {
    this.usersCollection = collection(this.firestore, 'users');

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.email = user.email ?? null;
      } else {
        this.userId = null;
        this.email = null;
      }
    });
  }

  async updateUserData(): Promise<void> {
    if (!this.userId) {
      console.warn('No UID provided, skipping updateUserData');
      return;
    }
    const userDoc = doc(this.firestore, `users/${this.userId}`);

    try {
      // setDoc with { merge: true } creates or updates the document safely
      console.log("Set Doc");
      await setDoc(
        userDoc,
        {
          userId: this.userId,
          email: this.email,
          // add more user properties if needed
        },
        { merge: true }
      );
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
