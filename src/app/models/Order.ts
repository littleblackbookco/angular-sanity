import { Book } from '../books/state/book.model';
import { Customer } from './Customer';

export interface Order {
  customer: Customer;
  books: Book[];
}
