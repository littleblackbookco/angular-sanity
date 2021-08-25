import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { arrayUpsert } from '@datorama/akita';
import { CartQuery } from '../../state/cart.query';
import { CartService } from '../../state/cart.service';
import { CartStore } from '../../state/cart.store';
import { CartInputComponent } from '../cart-input/cart-input.component';

@Component({
  selector: 'app-cart-widget',
  templateUrl: './cart-widget.component.html',
  styleUrls: ['./cart-widget.component.scss'],
})
export class CartWidgetComponent implements OnInit {
  @Input() itemId!: string;
  @Input() priceId!: string;
  @Input() price!: number;
  @Input() quantity!: number;
  @ViewChild('input', { read: CartInputComponent })
  cartInput!: CartInputComponent;
  constructor(private cartStore: CartStore, private cartService: CartService) {}

  ngOnInit(): void {}

  updateCart(quantity: number) {
    if (quantity === 0) {
      this.cartService.remove([this.itemId]);
    } else {
      this.cartService.update({
        id: this.itemId,
        price: this.price,
        priceId: this.priceId,
        quantity,
      });
    }
    // this.cartStore.update(CartStore.ID, (cart) => ({
    //   ...cart,
    //   items: arrayUpsert(cart.items, this.itemId, {
    //     priceId: this.priceId,
    //     quantity: this.cartInput.input.value,
    //   }),
    // }));
  }
}
