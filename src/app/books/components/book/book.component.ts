import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/models/Book';
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
