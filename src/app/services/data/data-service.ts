import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, updateDoc, deleteDoc, doc, query, where, arrayUnion } from '@angular/fire/firestore';
import { combineLatest, map, Observable } from 'rxjs';

export interface Note {
  id?: string;
  title: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private notesCollection;

  constructor(private firestore: Firestore) {
    this.notesCollection = collection(this.firestore, 'notes');
  }

  getNotesForUser(uid: string): Observable<Note[]> {
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

  async shareNoteWithUser(noteId: string, uid: string): Promise<void> {
    const noteRef = doc(this.firestore, `notes/${noteId}`);
    await updateDoc(noteRef, {
      sharedWith: arrayUnion(uid)
    });
  }
  // Create a new note
  async addNoteForUser(note: Note, uid: string): Promise<void> {
    console.log({ ...note, userId: uid });
    await addDoc(this.notesCollection, { ...note, userId: uid });
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
