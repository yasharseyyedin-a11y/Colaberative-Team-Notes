import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/user/auth-service';
import { Router } from '@angular/router';
import { UserService } from '../services/data/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.html',
  styleUrl: 'login.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  userService = inject(UserService);


  async loginWithGoogle() {
    try {
      // Sign in with Google popup using AngularFireAuth
      const result = await this.authService.signInWithGoogle();

      // Update user data in Firestore
      await this.userService.updateUserData();

      // Navigate to notes page
      this.router.navigate(['/notes']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
}
