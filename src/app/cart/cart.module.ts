import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { CartInputComponent } from './components/cart-input/cart-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';

@NgModule({
  declarations: [CartComponent, CartInputComponent, CartWidgetComponent],
  imports: [CommonModule, CartRoutingModule, ReactiveFormsModule],
  exports: [CartWidgetComponent],
})
export class CartModule {}
