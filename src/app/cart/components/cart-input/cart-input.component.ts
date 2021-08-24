import {
  AfterViewChecked,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { Cart } from '../../state/cart.model';
import { CartQuery } from '../../state/cart.query';
import { CartStore } from '../../state/cart.store';

@Component({
  selector: 'app-cart-input',
  templateUrl: './cart-input.component.html',
  styleUrls: ['./cart-input.component.scss'],
})
export class CartInputComponent implements OnInit, OnDestroy {
  @Input() itemId!: string;
  count = 0;
  onDestroyed = new Subject();
  constructor(private cartQuery: CartQuery) {}

  ngOnInit(): void {
    this.cartQuery
      .selectEntity(CartStore.ID)
      .pipe(
        takeUntil(this.onDestroyed),
        map((cart) => cart?.items),
        map((items) => items?.filter((itemId) => itemId === this.itemId)),
        map((items) => items?.length ?? 0),
        tap((itemId) => console.log('itemId', itemId))
      )
      .subscribe((count) => (this.count = count));
  }

  ngOnDestroy() {
    this.onDestroyed.next();
  }
}
