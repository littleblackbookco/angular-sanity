import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Cart, CartItem } from './cart.model';
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

  update(item: Partial<CartItem> & { id: string }) {
    this.cartStore.update(CartStore.ID, ({ items }) => ({
      items: arrayUpsert(items, item.id, item),
    }));
  }

  remove(itemIds: string[]) {
    this.cartStore.update(CartStore.ID, ({ items }) => ({
      items: arrayRemove(items, itemIds),
    }));
  }
}
