import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Note } from '../services/data/data-service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AddNoteComponent } from "../add-note/add-note";
import { AuthService } from '../services/user/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShareNoteComponent } from '../share-note/share-note';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, AddNoteComponent],
  templateUrl: 'notes-display.html',
  styleUrl: 'notes-display.css'
})

export class NotesComponent implements OnInit {

  notes$!: Observable<Note[]>;

  dataService = inject(DataService);
  authService = inject(AuthService);

  user: any;
  constructor(private router: Router) { }

  async ngOnInit() {
    this.user = await firstValueFrom(this.authService.currentUser$);
    console.log(this.user);
    if (this.user) {
      this.notes$ = this.dataService.getNotesForUser();
    } else {
      this.notes$ = of([]); // or handle no user case
    }
  }

  async deleteNote(id: string) {
    try {
      await this.dataService.deleteNote(id);
    } catch (error) {
      console.error('Delete failed', error);
    }
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

  editIndex: number | null = null;
  editNote: Note = { id: '', title: '', content: ''};

  startEdit(index: number, note: Note) {
    this.editIndex = index;
    this.editNote = { ...note }; // Clone note for editing
  }

  cancelEdit() {
    this.editIndex = null;
  }

  async updateNote() {
    try {
      await this.dataService.updateNote(this.editNote.id ?? '', {
        title: this.editNote.title,
        content: this.editNote.content
      });
      this.editIndex = null;
    } catch (error) {
      console.error('Update failed', error);
    }
  }

  dialog=inject(MatDialog);

  openShareModal(noteId: string) {
    this.dialog.open(ShareNoteComponent, {
      data: { noteId: noteId }
    });
  }
}
