import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Cart } from './cart.model';
import { CartStore } from './cart.store';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private cartStore: CartStore, private http: HttpClient) {}

  get() {
    return this.http.get<Cart[]>('https://api.com').pipe(
      tap((entities) => {
        this.cartStore.set(entities);
      })
    );
  }

  add(item: unknown) {
    this.cartStore.update(CartStore.ID, (cart) => ({
      items: [...cart.items, item],
    }));
  }

  update(id: ID, cart: Partial<Cart>) {
    this.cartStore.update(id, cart);
  }

  remove(id: ID) {
    this.cartStore.remove(id);
  }
}
