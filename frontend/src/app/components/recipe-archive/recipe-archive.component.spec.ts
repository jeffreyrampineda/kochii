import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeArchiveComponent } from './recipe-archive.component';

describe('RecipeArchiveComponent', () => {
  let component: RecipeArchiveComponent;
  let fixture: ComponentFixture<RecipeArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
