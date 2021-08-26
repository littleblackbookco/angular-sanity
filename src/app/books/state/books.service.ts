import { Injectable } from '@angular/core';
import { cacheable, filterNilValue } from '@datorama/akita';
import { map, switchMap, tap } from 'rxjs/operators';
import { SanityService } from 'src/app/services/sanity.service';
import { Book } from './book.model';
import { BooksStore } from './books.store';

@Injectable({ providedIn: 'root' })
export class BooksService {
  constructor(private booksStore: BooksStore, private sanity: SanityService) {}

  private convertBookDocument = `
    ...,
    images[] {
      caption,
      'url': image.asset->url
    },
    videos[] {
      asset-> {
        'url': 'https://stream.mux.com/' + playbackId,
        playbackId
      }
    }`;

  getAll() {
    const query = `*[_type=='book'] {
      ${this.convertBookDocument}
    }`;
    const request$ = this.sanity.o$.fetch(query).pipe(
      map((documents) => this.convertDocumentsToBooks(documents)),
      tap((books) => this.booksStore.set(books))
    );
    return cacheable(this.booksStore, request$, { emitNext: true });
  }

  getOne(documentId: string) {
    const query = `*[_type=='book' && _id == $documentId] {
      ${this.convertBookDocument}
    }`;
    const request$ = this.sanity.o$.fetch(query, { documentId }).pipe(
      map((documents) => this.convertDocumentsToBooks(documents)),
      tap((books) => this.booksStore.upsert(books[0].slug, books[0]))
    );
    return request$;
  }

  startListeningForBookUpdates() {
    const query = `*[_type=='book']`;
    this.sanity.o$
      .listen(query)
      .pipe(
        filterNilValue(),
        switchMap((event) => this.getOne(event.documentId))
      )
      .subscribe();
  }

  private convertDocumentsToBooks(documents: Record<string, any>[]): Book[] {
    return documents.map(
      (document) =>
        ({
          ...document,
          slug: document.slug.current,
          description: this.sanity.blocksToHtml({
            blocks: document.description,
          }),
        } as Book)
    );
  }
}
