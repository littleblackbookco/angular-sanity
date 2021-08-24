import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Book } from './book.model';
import { BooksStore } from './books.store';

@Injectable({ providedIn: 'root' })
export class BooksService {
  constructor(private booksStore: BooksStore, private http: HttpClient) {}

  get() {
    const request$ = this.http.get<Book[]>('/.netlify/functions/getBooks').pipe(
      tap((entities) => {
        this.booksStore.set(entities);
      })
    );
    return cacheable(this.booksStore, request$, { emitNext: true });
  }
}
