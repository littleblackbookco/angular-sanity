import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCostSummaryComponent } from './cart-cost-summary.component';

describe('CartCostSummaryComponent', () => {
  let component: CartCostSummaryComponent;
  let fixture: ComponentFixture<CartCostSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartCostSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartCostSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
