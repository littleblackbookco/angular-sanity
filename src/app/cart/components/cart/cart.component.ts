import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StripeError } from '@stripe/stripe-js';
import { debounceTime, map, shareReplay, switchMap } from 'rxjs/operators';
import { BooksQuery } from 'src/app/books/state/books.query';
import { StripeCard } from 'stripe-angular';
import { CartQuery } from '../../state/cart.query';
import { CartStore } from '../../state/cart.store';
import { Customer } from 'src/app/models/Customer';
import { Order } from 'src/app/models/Order';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @ViewChild('stripeCard', { read: StripeCard }) stripeCard!: StripeCard;
  customerForm = this.fb.group({
    contact: this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
    }),
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    }),
  });
  books$ = this.cartQuery.items$.pipe(
    switchMap((items) =>
      this.booksQuery.selectAll({
        filterBy: (book) => !!items.find((item) => item.id === book.slug),
      })
    )
  );
  cartTotal$ = this.cartQuery.items$.pipe(
    map((items) =>
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    )
  );
  displayCheckout = false;
  cardCaptureReady = false;
  invalidError!: any;
  cardDetailsFilledOut!: any;
  paymentSuccess = false;
  shippingRate$!: Observable<string>;
  total$!: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private cartQuery: CartQuery,
    private booksQuery: BooksQuery,
    private http: HttpClient
  ) {}

  getShippingRate(event: Event) {
    event.preventDefault();

    const order$ = this.cartQuery.selectEntity(CartStore.ID).pipe(
      map((cart) => {
        const bookIds = cart?.items.map((item) => item.id);
        const books = this.booksQuery
          .getAll({
            filterBy: (book) => !!bookIds?.find((slug) => slug === book.slug),
          })
          .map((book) => {
            const cartItem = cart?.items.find((item) => item.id === book.slug);
            const quantity = cartItem?.quantity ?? book.quantity;
            return { ...book, quantity };
          });

        const customer: Customer = {
          email: this.customerForm.get('contact.email')?.value,
          name: this.customerForm.get('contact.name')?.value,
          address: this.customerForm.get('address')?.value,
        };
        const order: Order = {
          customer,
          books,
        };
        return order;
      })
    );

    this.shippingRate$ = order$.pipe(
      debounceTime(250),
      switchMap((order) =>
        this.http
          .post<{ shippingRate: number }>(
            '/.netlify/functions/getShippingRate',
            order
          )
          .pipe(
            map((response) => response.shippingRate),
            map((shippingRate) => {
              const dollars = +`${shippingRate}`.split('.')[0];
              const cents = Math.floor((shippingRate * 100) % 100);
              return `${dollars}.${cents}`;
            })
          )
      ),
      shareReplay()
    );

    this.total$ = combineLatest([this.cartTotal$, this.shippingRate$]).pipe(
      map((values) => {
        const [cartTotal, shippingRate] = values;
        const shippingTotal = +shippingRate;
        const total = cartTotal + shippingTotal;
        const dollars = +`${total}`.split('.')[0];
        const cents = Math.floor((total * 100) % 100);
        return `${dollars}.${cents}`;
      })
    );
  }

  payWithCard(event: Event) {
    event.preventDefault();
    const cart = this.cartQuery.getEntity(CartStore.ID);
    const items = cart?.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    const zipDestination = this.customerForm.get('address.zip')?.value;
    const order = { zipDestination, items };
    this.http
      .post('/.netlify/functions/createPaymentIntent', order)
      .subscribe((response: any) => {
        this.stripeCard.stripe
          .confirmCardPayment(response.clientSecret, {
            payment_method: { card: this.stripeCard.elements },
          })
          .then((paymentResponse) => {
            if (paymentResponse.error) {
              console.log(paymentResponse);
            } else {
              this.paymentSuccess = true;
            }
          });
      });
  }

  showCheckout() {
    this.displayCheckout = true;
  }

  onStripeInvalid(error: StripeError) {
    console.log('Validation Error', error);
  }

  onStripeError(error: any) {
    console.error('Stripe error', error);
  }

  setPaymentMethod(token: stripe.paymentMethod.PaymentMethod) {
    console.log('Stripe Payment Method', token);
  }

  setStripeToken(token: stripe.Token) {
    console.log('Stripe Token', token);
  }

  setStripeSource(source: stripe.Source) {
    console.log('Stripe Source', source);
  }
}
