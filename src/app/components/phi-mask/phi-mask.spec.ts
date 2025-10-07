import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhiMask } from './phi-mask';

describe('PhiMask', () => {
  let component: PhiMask;
  let fixture: ComponentFixture<PhiMask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhiMask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhiMask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
