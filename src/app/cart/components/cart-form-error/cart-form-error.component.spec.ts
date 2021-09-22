import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFormErrorComponent } from './cart-form-error.component';

describe('CartFormErrorComponent', () => {
  let component: CartFormErrorComponent;
  let fixture: ComponentFixture<CartFormErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartFormErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartFormErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
