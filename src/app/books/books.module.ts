import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './components/books/books.component';
import { BookComponent } from './components/book/book.component';
import { BooksRoutingModule } from './books-routing.module';
import { CarouselModule } from '../components/carousel/carousel.module';
import { CartModule } from '../cart/cart.module';
import { ItemPreviewModule } from '../components/item-preview/item-preview.module';

@NgModule({
  declarations: [BooksComponent, BookComponent],
  imports: [
    CommonModule,
    BooksRoutingModule,
    CarouselModule,
    CartModule,
    ItemPreviewModule,
  ],
})
export class BooksModule {}
