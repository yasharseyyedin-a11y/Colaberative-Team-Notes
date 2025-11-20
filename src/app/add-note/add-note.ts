import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, Note } from '../services/data/data-service'; // Your existing service
import { AuthService } from '../services/user/auth-service'; // To get current user info
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: 'add-note.html',
  styleUrl: 'add-note.css'
})
export class AddNoteComponent {
  note: Note = { title: '', content: '' };
  message = '';

  dataService = inject(DataService);
  authService = inject(AuthService);

  async addNote() {
    const user = await firstValueFrom(this.authService.currentUser$);
    if (!user) {
      this.message = 'You must be logged in to add notes.';
      return;
    }
    try {
      await this.dataService.addNoteForUser(this.note);
      this.message = 'Note added successfully!';
      this.note = { title: '', content: '' };
    } catch (error) {
      this.message = 'Error adding note: ' + error;
    }
  }
}
