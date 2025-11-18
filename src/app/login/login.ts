import { Component, inject } from '@angular/core';
import { AuthService } from '../services/user/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.html',
})
export class LoginComponent {
  authService = inject(AuthService);

  constructor(private router: Router) {}

  async loginWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/notes']); // navigate to notes after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
}
