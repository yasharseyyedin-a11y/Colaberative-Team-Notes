import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareNote } from './share-note';

describe('ShareNote', () => {
  let component: ShareNote;
  let fixture: ComponentFixture<ShareNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareNote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareNote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
