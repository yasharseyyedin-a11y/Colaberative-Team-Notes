import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, updateDoc, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
    const notesQuery = query(this.notesCollection, where('userId', '==', uid));
    return collectionData(notesQuery, { idField: 'id' }) as Observable<Note[]>;
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
