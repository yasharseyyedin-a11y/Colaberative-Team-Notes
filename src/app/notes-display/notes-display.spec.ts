import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDisplay } from './notes-display';

describe('NotesDisplay', () => {
  let component: NotesDisplay;
  let fixture: ComponentFixture<NotesDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
