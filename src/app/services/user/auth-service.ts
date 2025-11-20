import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  authState$: Observable<User | null>;
  
  constructor(private auth: Auth) {
    // Subscribe internally to Firebase auth state changes
    this.authState$ = new Observable<User | null>(subscriber => {
      return this.auth.onAuthStateChanged(
        user => {
          console.log(user);
          subscriber.next(user);
          this.currentUserSubject.next(user);
        },
        error => subscriber.error(error),
        () => subscriber.complete()
      );
    });

    this.auth.onAuthStateChanged(user => this.currentUserSubject.next(user));
  }

  // Email/password sign-in
  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Google sign-in
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async signOut() {
    await signOut(this.auth);
  }
}
