import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Cart } from './cart.model';

export interface CartState extends EntityState<Cart> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'cart',
  cache: {
    ttl: 86400, // cache expires in 24 hours
  },
})
export class CartStore extends EntityStore<CartState> {
  static ID = 1;
  constructor() {
    super();
    this.add({ id: 1, items: [] });
  }
}
