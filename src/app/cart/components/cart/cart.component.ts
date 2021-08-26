import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeError, Token } from '@stripe/stripe-js';
import { map, switchMap } from 'rxjs/operators';
import { BooksQuery } from 'src/app/books/state/books.query';
import { StripeCard } from 'stripe-angular';
import { CartQuery } from '../../state/cart.query';
import { CartStore } from '../../state/cart.store';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
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
  total$ = this.cartQuery.items$.pipe(
    map((items) =>
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    )
  );
  cardCaptureReady = false;
  invalidError!: any;
  cardDetailsFilledOut!: any;
  constructor(
    private fb: FormBuilder,
    private cartQuery: CartQuery,
    private booksQuery: BooksQuery,
    private http: HttpClient
  ) {}

  ngOnInit() {}
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
        console.log('createPaymentIntent', response);
        // this.stripeCard.token = response.clientSecret;
        this.stripeCard.stripe
          .confirmCardPayment(response.clientSecret, {
            payment_method: { card: this.stripeCard.elements },
          })
          .then((paymentResponse) => {
            console.log('paymentResponse', paymentResponse);
            // if (paymentResponse.error) {

            // } else {

            // }
          });
      });
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
