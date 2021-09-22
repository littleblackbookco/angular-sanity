import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartPaymentFormComponent } from './cart-payment-form.component';

describe('CartPaymentFormComponent', () => {
  let component: CartPaymentFormComponent;
  let fixture: ComponentFixture<CartPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartPaymentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
