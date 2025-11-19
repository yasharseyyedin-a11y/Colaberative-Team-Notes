import { Component, Inject, inject } from '@angular/core';
import { DataService } from '../services/data/data-service';
import { UserService } from '../services/user/user-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-share-note',
  templateUrl: 'share-note.html',
  imports: [FormsModule, CommonModule]
})
export class ShareNoteComponent {
  noteId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { noteId: string }) {
    this.noteId = data.noteId;
  }
  
  emailToShare = '';
  errorMessage = '';

  dataService = inject(DataService);
  userService = inject(UserService);

  async share() {
    console.log("note id to be shared", this.noteId);
    const uid = await this.userService.getUidByEmail(this.emailToShare);
    console.log("adding uid:", uid);
    if (uid) {
      await this.dataService.shareNoteWithUser(this.noteId, uid);
      this.close();
    } else {
      this.errorMessage = 'User not found';
    }
  }

  close() {
    // s modal logic here
  }
}
