import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { BooksQuery } from '../../state/books.query';
import { BooksService } from '../../state/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  books$ = this.booksQuery.selectAll();

  constructor(
    private booksService: BooksService,
    private booksQuery: BooksQuery
  ) {}

  ngOnInit(): void {
    this.booksService.get().pipe(take(1)).subscribe();
  }
}
