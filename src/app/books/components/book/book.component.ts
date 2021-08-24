import { Component, OnInit } from '@angular/core';
import { filterNilValue } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartQuery } from 'src/app/cart/state/cart.query';
import { CartService } from 'src/app/cart/state/cart.service';
import { CartStore } from 'src/app/cart/state/cart.store';
import { Book, BookImage } from '../../state/book.model';
import { BooksQuery } from '../../state/books.query';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  book$ = this.booksQuery.currentlyViewedBook$;
  images$: Observable<BookImage[]> = this.book$.pipe(
    filterNilValue(),
    map((book) => book.images)
  );
  video$ = this.book$.pipe(
    filterNilValue(),
    map((book) => book.videos)
  );
  cart$ = this.cartQuery.select(CartStore.ID);
  constructor(private booksQuery: BooksQuery, private cartQuery: CartQuery) {}

  ngOnInit(): void {}
}
