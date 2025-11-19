import { Component, OnInit, inject, ɵsetUnknownPropertyStrictMode } from '@angular/core';
import { AuthService } from '../services/user/auth-service';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.html',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);

  constructor(private router: Router, private userService:UserService) { }

  userId: string | null = null;
  email: string | null = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.email = user.email ?? null;
        console.log('User ID:', this.userId);
        console.log('Email:', this.email);
      } else {
        this.userId = null;
        this.email = null;
      }
    });
  }

  async loginWithGoogle() {
    try {
      // Sign in with Google popup using AngularFireAuth
      const result = await this.authService.signInWithGoogle();
      if (!this.userId || !this.email) {
        console.log("user id and email not provided!");
      }

      // Update user data in Firestore
      await this.userService.updateUserData(this.userId ?? '', this.email ?? '');

      // Navigate to notes page
      this.router.navigate(['/notes']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

}
