import { Injectable } from '@angular/core';
import { filterNilValue, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { BooksQuery } from 'src/app/books/state/books.query';
import { Customer } from 'src/app/models/Customer';
import { Order } from 'src/app/models/Order';
import { CartStore, CartState } from './cart.store';

@Injectable({ providedIn: 'root' })
export class CartQuery extends QueryEntity<CartState> {
  items$ = this.selectEntity(CartStore.ID, 'items').pipe(
    filterNilValue(),
    shareReplay()
  );
  subTotal$ = this.items$.pipe(
    map((items) =>
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    )
  );
  booksFromCart$ = this.items$.pipe(
    switchMap((items) =>
      this.booksQuery.selectAll({
        filterBy: (book) => !!items.find((item) => item.id === book.slug),
      })
    )
  );
  constructor(protected store: CartStore, private booksQuery: BooksQuery) {
    super(store);
  }

  asOrder(customer: Customer): Observable<Order> {
    return this.selectEntity(CartStore.ID).pipe(
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

        const order: Order = {
          customer,
          books,
        };
        return order;
      })
    );
  }
}
