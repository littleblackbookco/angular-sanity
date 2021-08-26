import { Injectable } from '@angular/core';
import { filterNilValue, QueryEntity } from '@datorama/akita';
import { CartStore, CartState } from './cart.store';

@Injectable({ providedIn: 'root' })
export class CartQuery extends QueryEntity<CartState> {
  items$ = this.selectEntity(CartStore.ID, 'items').pipe(filterNilValue());
  constructor(protected store: CartStore) {
    super(store);
  }
}
