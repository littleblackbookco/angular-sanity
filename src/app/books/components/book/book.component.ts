import { Component, OnInit } from '@angular/core';
import { filterNil, filterNilValue } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookImage } from '../../state/book.model';
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
  constructor(private booksQuery: BooksQuery) {}

  ngOnInit(): void {}
}
