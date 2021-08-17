import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../state/book.model';
import { BooksService } from '../../state/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  books$!: Observable<Book[]>;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.books$ = this.booksService.get();
  }
}
