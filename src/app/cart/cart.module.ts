import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { CartInputComponent } from './components/cart-input/cart-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';
import { ItemPreviewModule } from '../components/item-preview/item-preview.module';
import { StripeModule } from 'stripe-angular';
import { CartEmptyComponent } from './components/cart-empty/cart-empty.component';
import { StateSelectorModule } from '../components/state-selector/state-selector.module';
import { CartCheckoutFormComponent } from './components/cart-checkout-form/cart-checkout-form.component';
import { CartPaymentFormComponent } from './components/cart-payment-form/cart-payment-form.component';
import { CartFormErrorComponent } from './components/cart-form-error/cart-form-error.component';
import { CartCostSummaryComponent } from './components/cart-cost-summary/cart-cost-summary.component';

@NgModule({
  declarations: [
    CartComponent,
    CartInputComponent,
    CartWidgetComponent,
    CartEmptyComponent,
    CartCheckoutFormComponent,
    CartPaymentFormComponent,
    CartFormErrorComponent,
    CartCostSummaryComponent,
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    ReactiveFormsModule,
    ItemPreviewModule,
    StateSelectorModule,
    StripeModule.forRoot(
      'pk_test_51JRHgjAxw5aEVPjYTdhWR0aiFvCusWRkSjTNKqOemP3nBvQyJC2bFnG91ARpQpzWqxu677O8wCs8WHIJQpQGmPjK00E2bpiMtU'
    ),
  ],
  exports: [CartWidgetComponent],
})
export class CartModule {}
