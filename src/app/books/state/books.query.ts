import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filterNilValue, QueryEntity } from '@datorama/akita';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { combineLatest, Observable } from 'rxjs';
import { exhaustMap, map, tap } from 'rxjs/operators';
import { Book } from './book.model';
import { BooksService } from './books.service';
import { BooksStore, BooksState } from './books.store';

@Injectable({ providedIn: 'root' })
export class BooksQuery extends QueryEntity<BooksState> {
  // currentlyViewedBook$ = this.routerQuery.selectParams('slug').pipe(
  //   exhaustMap((slug) => this.selectEntity((book: Book) => book.slug === slug)),
  //   tap((book) => {
  //     if (book === undefined) {
  //       this.router.navigateByUrl('not-found');
  //     }
  //   })
  currentlyViewedBook$ = this.selectHasCache().pipe(
    exhaustMap((hasCache) => {
      const books$ = hasCache ? this.selectAll() : this.booksService.getAll();
      return combineLatest([books$, this.routerQuery.selectParams('slug')]);
    }),
    map(([books, slug]) => books?.find((book: Book) => book.slug === slug)),
    tap((book) => {
      if (book === undefined) {
        this.router.navigateByUrl('not-found');
      }
    })
  );

  constructor(
    private booksService: BooksService,
    private router: Router,
    private routerQuery: RouterQuery,
    protected store: BooksStore
  ) {
    super(store);
  }
}
