import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  map,
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { Order } from 'src/app/models/Order';
import { CartQuery } from '../../state/cart.query';

@Component({
  selector: 'app-cart-cost-summary',
  templateUrl: './cart-cost-summary.component.html',
  styleUrls: ['./cart-cost-summary.component.scss'],
})
export class CartCostSummaryComponent implements AfterViewInit, OnDestroy {
  shipping$?: Observable<string>;
  subTotal$ = this.cartQuery.subTotal$;
  total$?: Observable<string>;

  @Input() order$!: Observable<Order>;
  private onDestroy = new Subject();

  constructor(private cartQuery: CartQuery, private http: HttpClient) {}

  ngAfterViewInit() {
    this.shipping$ = this.order$.pipe(
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

    this.total$ = combineLatest([this.subTotal$, this.shipping$]).pipe(
      takeUntil(this.onDestroy),
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

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
