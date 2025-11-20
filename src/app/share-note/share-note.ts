import { Component, Inject, inject } from '@angular/core';
import { DataService } from '../services/data/data-service';
import { UserService } from '../services/data/user-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-share-note',
  templateUrl: 'share-note.html',
  styleUrl: 'share-note.css',
  imports: [FormsModule, CommonModule]
})
export class ShareNoteComponent {
  noteId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { noteId: string },
    private dialogRef: MatDialogRef<ShareNoteComponent>) {
    this.noteId = data.noteId;
  }

  emailToShare = '';
  errorMessage = '';

  dataService = inject(DataService);
  userService = inject(UserService);

  async share() {
    const uid = await this.userService.getUidByEmail(this.emailToShare);
    if (uid) {
      await this.dataService.shareNoteWithUser(this.noteId, uid);
      this.close();
    } else {
      this.errorMessage = 'User not found';
    }
  }

  close() {
    this.dialogRef.close();
  }
}
