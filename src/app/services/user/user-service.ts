import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User, UserInfo } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private afAuth!: AngularFireAuth;
  private firestore!: AngularFirestore;

  constructor(private environmentInjector: EnvironmentInjector) {
    runInInjectionContext(this.environmentInjector, () => {
      this.afAuth = inject(AngularFireAuth);
      this.firestore = inject(AngularFirestore);

      this.afAuth.authState.subscribe((user) => {
        if (user) {
          const safeUser = {
            ...user,
            providerData: user.providerData.filter((p): p is UserInfo => p !== null),
          };
          this.updateUserData(safeUser);
        }
      });
    });
  }

  private updateUserData(user: User) {
    runInInjectionContext(this.environmentInjector, () => {
      console.log(this.firestore);
      if (!user?.uid) {
        return;
      }
      console.log('getting userRed');
      const userRef = this.firestore.doc(`users/${user.uid}`);
      userRef.get().subscribe((docSnapshot) => {
        if (!docSnapshot.exists) {
          userRef.set(
            {
              uid: user.uid,
              email: user.email ?? '',
            },
            { merge: true }
          );
        }
      });
    });
  }

  async getUidByEmail(email: string): Promise<string | null> {
    return runInInjectionContext(this.environmentInjector, async () => {
      if (!this.firestore) {
        return null;
      }
      const querySnapshot = await this.firestore
        .collection('users', (ref) => ref.where('email', '==', email))
        .get()
        .toPromise();

      if (querySnapshot && !querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      return null;
    });
  }
}
