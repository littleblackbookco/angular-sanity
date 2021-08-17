import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { BookImage, BookVideo } from 'src/app/books/state/book.model';
import { fadeIn, fadeOut } from './carousel.animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [useAnimation(fadeIn)]),
      transition('* => void', [useAnimation(fadeOut)]),
    ]),
  ],
})
export class CarouselComponent implements OnInit {
  @Input() slides!: (BookImage | BookVideo)[];
  currentSlide = 0;

  constructor() {}

  ngOnInit(): void {}

  isBookImage(slide: BookImage | BookVideo): slide is BookImage {
    if (Object.getOwnPropertyNames(slide).includes('asset')) {
      return false;
    } else {
      return true;
    }
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }
}
