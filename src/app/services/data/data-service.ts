import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, updateDoc, deleteDoc, doc, query, where, arrayUnion } from '@angular/fire/firestore';
import { combineLatest, map, Observable } from 'rxjs';
import { AuthService } from '../user/auth-service';

export interface Note {
  id?: string;
  title: string;
  content: string;
  ownerId?: string;
  sharedWith?: string[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private notesCollection;
  firestore = inject(Firestore);
  authService = inject(AuthService);

  private currentUserId?: string;

  constructor() {
    this.notesCollection = collection(this.firestore, 'notes');

    // Subscribe to user changes and update currentUserId
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.uid;
    });
  }

  getNotesForUser(): Observable<Note[]> {
    if (!this.currentUserId) {
      // User not loaded yet, return empty or handle as needed
      return new Observable<Note[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    
    const uid = this.currentUserId;
    
    const ownedNotesQuery = query(this.notesCollection, where('ownerId', '==', uid));
    const sharedNotesQuery = query(this.notesCollection, where('sharedWith', 'array-contains', uid));

    const ownedNotes$ = collectionData(ownedNotesQuery, { idField: 'id' }) as Observable<Note[]>;
    const sharedNotes$ = collectionData(sharedNotesQuery, { idField: 'id' }) as Observable<Note[]>;

    // Combine owned and shared notes into single observable array, and remove duplicates if any
    return combineLatest([ownedNotes$, sharedNotes$]).pipe(
      map(([ownedNotes, sharedNotes]) => {
        const allNotes = [...ownedNotes];
        // Add shared notes that are not already in ownedNotes by id
        for (const note of sharedNotes) {
          if (!allNotes.find(n => n.id === note.id)) {
            allNotes.push(note);
          }
        }
        return allNotes;
      })
    );
  }

  async shareNoteWithUser(id: string, uid: string): Promise<void> {
    const noteDoc = doc(this.firestore, `notes/${id}`);
    await updateDoc(noteDoc, {
      sharedWith: arrayUnion(uid)
    });
  }
  // Create a new note
  async addNoteForUser(note: Note): Promise<void> {
    await addDoc(this.notesCollection, { ...note, ownerId: this.currentUserId });
  }

  // Update an existing note by id
  async updateNote(id: string, data: Partial<Note>): Promise<void> {
    const noteDoc = doc(this.firestore, `notes/${id}`);
    await updateDoc(noteDoc, data);
  }

  // Delete a note by id
  async deleteNote(id: string): Promise<void> {
    const noteDoc = doc(this.firestore, `notes/${id}`);
    await deleteDoc(noteDoc);
  }
}
