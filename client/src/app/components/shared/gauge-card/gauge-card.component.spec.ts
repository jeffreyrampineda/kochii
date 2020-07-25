import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeCardComponent } from './gauge-card.component';

describe('GaugeCardComponent', () => {
  let component: GaugeCardComponent;
  let fixture: ComponentFixture<GaugeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
