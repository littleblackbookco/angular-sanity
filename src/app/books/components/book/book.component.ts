import { Component, OnInit } from '@angular/core';
import { filterNil, filterNilValue } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { BooksQuery } from '../../state/books.query';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  book$ = this.booksQuery.currentlyViewedBook$;
  slides$ = this.book$.pipe(
    filterNilValue(),
    map((book) => [...book.videos, ...book.images])
  );
  constructor(private booksQuery: BooksQuery) {}

  ngOnInit(): void {}
}
