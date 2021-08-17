import { Component, OnInit } from '@angular/core';
import { BooksQuery } from '../../state/books.query';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  book$ = this.booksQuery.currentlyViewedBook$;
  constructor(private booksQuery: BooksQuery) {}

  ngOnInit(): void {}
}
