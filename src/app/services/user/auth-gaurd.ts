import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { AuthService } from '../user/auth-service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  canActivate(): Observable<boolean> {
    if (!this.isBrowser) {
      return of(true);
    }
    // Wait for auth state to resolve by taking first emission
    return this.authService.currentUser$.pipe(
      take(1), // Wait for initial auth state
      map(user => !!user), // Convert user object to boolean
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
