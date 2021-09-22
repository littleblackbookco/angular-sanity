import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StripeError } from '@stripe/stripe-js';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { StripeCard } from 'stripe-angular';
import { CartQuery } from '../../state/cart.query';
import { CartStore } from '../../state/cart.store';

@Component({
  selector: 'app-cart-payment-form',
  templateUrl: './cart-payment-form.component.html',
  styleUrls: ['./cart-payment-form.component.scss'],
})
export class CartPaymentFormComponent implements OnInit, OnDestroy {
  @Input() customerForm!: FormGroup;
  @ViewChild('stripeCard', { read: StripeCard }) stripeCard!: StripeCard;
  submittingPayment$: Observable<boolean>;
  // paymentSuccess = false;
  private submittingPayment = new Subject<boolean>();
  private onDestroy = new Subject();
  constructor(
    private cartQuery: CartQuery,
    private http: HttpClient,
    private router: Router
  ) {
    this.submittingPayment$ = this.submittingPayment.asObservable();
  }

  ngOnInit(): void {
    this.submittingPayment$
      .pipe(
        takeUntil(this.onDestroy),
        map((loading) => {
          if (loading === true) {
            this.customerForm.disable();
          } else {
            this.customerForm.enable();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  payWithCard(event: Event) {
    event.preventDefault();
    this.submittingPayment.next(true);
    const cart = this.cartQuery.getEntity(CartStore.ID);
    const items = cart?.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    const order = { customer: this.customerForm.value, items };
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
              this.router.navigate(['payment-success']);
              // this.paymentSuccess = true;
            }
            this.submittingPayment.next(false);
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
