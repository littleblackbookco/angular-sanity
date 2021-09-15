import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { CartInputComponent } from './components/cart-input/cart-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';
import { ItemPreviewModule } from '../components/item-preview/item-preview.module';
import { StripeModule } from 'stripe-angular';
import { environment } from 'src/environments/environment';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { CartEmptyComponent } from './components/cart-empty/cart-empty.component';
import { StateSelectorModule } from '../components/state-selector/state-selector.module';

@NgModule({
  declarations: [
    CartComponent,
    CartInputComponent,
    CartWidgetComponent,
    PaymentSuccessComponent,
    CartEmptyComponent,
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    ReactiveFormsModule,
    ItemPreviewModule,
    StateSelectorModule,
    StripeModule.forRoot(
      environment.production
        ? ''
        : 'pk_test_51JRHgjAxw5aEVPjYTdhWR0aiFvCusWRkSjTNKqOemP3nBvQyJC2bFnG91ARpQpzWqxu677O8wCs8WHIJQpQGmPjK00E2bpiMtU'
    ),
  ],
  exports: [CartWidgetComponent],
})
export class CartModule {}
