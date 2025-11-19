import { Component, inject, input } from '@angular/core';
import { DataService } from '../services/data/data-service';
import { UserService } from '../services/user/user-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-note',
  templateUrl: 'share-note.html',
  imports:[FormsModule, CommonModule]
})
export class ShareNoteComponent {
  noteId = input("");
  emailToShare = '';
  errorMessage = '';

  dataService = inject(DataService);
  userService = inject(UserService);

  async share() {
    const uid = await this.userService.getUidByEmail(this.emailToShare);
    if (uid) {
      await this.dataService.shareNoteWithUser(this.noteId(), uid);
      this.close();
    } else {
      this.errorMessage = 'User not found';
    }
  }

  close() {
    // s modal logic here
  }
}
