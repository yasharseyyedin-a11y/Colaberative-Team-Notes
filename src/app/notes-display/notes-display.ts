import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Note } from '../services/data/data-service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AddNoteComponent } from "../add-note/add-note";
import { AuthService } from '../services/user/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, AddNoteComponent],
  templateUrl: 'notes-display.html'
})

export class NotesComponent implements OnInit {
  notes$!: Observable<Note[]>;

  dataService = inject(DataService);
  authService = inject(AuthService);

  constructor(private router: Router) { }

  async ngOnInit() {
    const user = await firstValueFrom(this.authService.currentUser$);
    if (user) {
      this.notes$ = this.dataService.getNotesForUser(user.uid);
    } else {
      this.notes$ = of([]); // or handle no user case
    }
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
