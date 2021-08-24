import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { BooksService } from './books/state/books.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.booksService.getAll().pipe(take(1)).subscribe();
    this.booksService.startListeningForBookUpdates();
  }
}
