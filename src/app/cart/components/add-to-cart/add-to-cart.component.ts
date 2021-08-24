import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../state/cart.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {
  @Input() item: unknown;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  addToCart() {
    this.cartService.add(this.item);
  }
}
