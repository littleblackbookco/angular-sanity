import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Book } from '../models/Book';
import { OrdersService } from './orders.service';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient, private ordersService: OrdersService) {}

  getBooks(): Observable<Book[]> {
    return this.http
      .get<Book[]>('/.netlify/functions/getBooks', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((books) =>
          this.ordersService.addOrder({
            books,
            customer: {
              name: 'Bob Man',
              email: 'bobman@gmail.com',
              address: {
                street: '1002 highland pines rd',
                city: 'ladson',
                state: 'sc',
                zip: '29456',
              },
            },
          })
        )
      );
  }
}
