import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCheckoutFormComponent } from './cart-checkout-form.component';

describe('CartCheckoutFormComponent', () => {
  let component: CartCheckoutFormComponent;
  let fixture: ComponentFixture<CartCheckoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartCheckoutFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartCheckoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
