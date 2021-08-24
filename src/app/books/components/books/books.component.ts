import { Component } from '@angular/core';
import { BooksQuery } from '../../state/books.query';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent {
  books$ = this.booksQuery.selectAll();

  constructor(private booksQuery: BooksQuery) {}
}
