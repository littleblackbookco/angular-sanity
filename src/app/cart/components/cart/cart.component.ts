import { Component, ViewChild } from '@angular/core';
import { CartQuery } from '../../state/cart.query';
import { Order } from 'src/app/models/Order';
import { Observable } from 'rxjs';
import { Book } from 'src/app/books/state/book.model';
import { CartService } from '../../state/cart.service';
import { CartCheckoutFormComponent } from '../cart-checkout-form/cart-checkout-form.component';
import { CartCostSummaryComponent } from '../cart-cost-summary/cart-cost-summary.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @ViewChild('checkout', { read: CartCheckoutFormComponent })
  checkout?: CartCheckoutFormComponent;
  @ViewChild('costSummary', { read: CartCostSummaryComponent })
  costSummary!: CartCostSummaryComponent;
  books$ = this.cartQuery.booksFromCart$;
  subTotal$ = this.cartQuery.subTotal$;

  displayCheckout = false;
  shippingRate$!: Observable<string>;
  showPayment = false;
  order$!: Observable<Order>;

  constructor(private cartQuery: CartQuery, private cartService: CartService) {}

  getShippingRate(event: Event) {
    event.preventDefault();
    this.checkout?.customerForm.get('address')?.disable();
    const order$ = this.cartQuery.asOrder({
      email: this.checkout?.customerForm.get('contact.email')?.value,
      name: this.checkout?.customerForm.get('contact.name')?.value,
      address: this.checkout?.customerForm.get('address')?.value,
    });
    this.order$ = order$;
    this.showPayment = true;
  }

  removeFromCart(book: Book) {
    if (
      confirm(`Are you sure you want to remove ${book.title} from your cart?`)
    ) {
      this.cartService.remove([book.slug]);
    }
  }

  showCheckout() {
    this.displayCheckout = true;
  }
}
