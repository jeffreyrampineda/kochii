import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemUpdateComponent } from './item-update.component';

describe('ItemUpdateComponent', () => {
  let component: ItemUpdateComponent;
  let fixture: ComponentFixture<ItemUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
