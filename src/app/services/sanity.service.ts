import { Inject, Injectable } from '@angular/core';
import { SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
const blocksToHtml = require('@sanity/block-content-to-html');

@Injectable({
  providedIn: 'root',
})
export class SanityService {
  o$ = this.client.observable;
  private imageUrlBuilder = imageUrlBuilder(this.client);
  constructor(@Inject('SanityClient') private client: SanityClient) {}

  blocksToHtml(blocks: any) {
    return blocksToHtml(blocks);
  }

  urlFor(source: SanityImageSource) {
    return this.imageUrlBuilder.image(source);
  }
}
