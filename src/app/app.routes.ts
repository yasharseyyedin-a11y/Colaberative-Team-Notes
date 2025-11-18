import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { NotesComponent } from './notes-display/notes-display';
import { AuthGuard } from './services/user/auth-gaurd';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/notes', pathMatch: 'full' },
    { path: '**', redirectTo: '/notes' },
];
