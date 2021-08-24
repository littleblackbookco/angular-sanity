import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { CartInputComponent } from './components/cart-input/cart-input.component';

@NgModule({
  declarations: [CartComponent, AddToCartComponent, CartInputComponent],
  imports: [CommonModule, CartRoutingModule],
  exports: [AddToCartComponent, CartInputComponent],
})
export class CartModule {}
