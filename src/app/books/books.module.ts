import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './components/books/books.component';
import { BookComponent } from './components/book/book.component';
import { BooksRoutingModule } from './books-routing.module';
import { BookPreviewComponent } from './components/book-preview/book-preview.component';

@NgModule({
  declarations: [BooksComponent, BookComponent, BookPreviewComponent],
  imports: [CommonModule, BooksRoutingModule],
})
export class BooksModule {}
