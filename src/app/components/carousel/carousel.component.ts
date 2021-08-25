import { trigger, transition, useAnimation } from '@angular/animations';
import { ElementRef, OnDestroy } from '@angular/core';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BookImage, BookVideo } from 'src/app/books/state/book.model';
import { fadeIn, fadeOut } from './carousel.animations';
import videojs from 'video.js';

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
export class CarouselComponent implements OnDestroy, OnInit, AfterViewInit {
  @Input() images!: BookImage[];
  @Input() videos!: BookVideo[];
  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;
  currentSlide = 0;
  player!: videojs.Player;
  slides!: any[];
  private videoSrcBase = 'https://stream.mux.com';

  constructor() {}

  ngAfterViewInit() {
    const sources = this.videos
      ? this.videos.map((video) => ({
          src: `${this.videoSrcBase}/${video.asset.playbackId}`,
          type: 'application/x-mpegURL',
        }))
      : [];
    this.player = videojs(this.videoRef.nativeElement.id, {
      autoplay: false,
      fluid: true,
      sources,
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  ngOnInit(): void {
    this.slides = [...this.images, ...this.videos];
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    this.handleVideoPlayer();
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    this.handleVideoPlayer();
  }

  private handleVideoPlayer() {
    if (this.slides[this.currentSlide].asset) {
      this.player.show();
    } else {
      this.player.pause();
      this.player.hide();
    }
  }
}
