import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  addOrder(order: Order) {
    console.log('order', order);
    this.http.post('/.netlify/functions/addOrder', order).subscribe();
  }
}
