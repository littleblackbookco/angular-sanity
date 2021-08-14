import { Book } from './Book';
import { Customer } from './Customer';

export interface Order {
  customer: Customer;
  books: Book[];
}
