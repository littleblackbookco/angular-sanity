import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Package } from '../models/Package';
import * as parser from 'fast-xml-parser';
import { UspsRateResponse } from '../models/RateV4Response';
import { map } from 'rxjs/operators';
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  url = 'https://secure.shippingapis.com/ShippingAPI.dll';
  zipOrigination = '29445';

  constructor(private http: HttpClient) {}

  getShippingRate(order: Order) {
    const pkg = this.orderToPackage(order);
    const xml = this.rateXml(pkg);
    const params = new HttpParams().set('API', 'RateV4').set('XML', xml);
    return this.http
      .get(this.url, {
        responseType: 'text',
        params,
      })
      .pipe(
        map((xmlResponse) => {
          const uspsObj = this.xmlToObj(xmlResponse);
          const shippingRate = uspsObj.RateV4Response.Package.Postage.Rate;
          return shippingRate;
        })
      );
  }

  private rateXml(pkg: Package): string {
    return `<RateV4Request USERID="708LITTL4773">
      <Revision>2</Revision>
      <Package ID="0">
        <Service>PRIORITY</Service>
        <ZipOrigination>${this.zipOrigination}</ZipOrigination>
        <ZipDestination>${pkg.zipDestination}</ZipDestination>
        <Pounds>${pkg.pounds}</Pounds>
        <Ounces>${pkg.ounces}</Ounces>
        <Length>${pkg.length + 1}</Length>
        <Width>${pkg.width + 1}</Width>
        <Height>${pkg.height + 1}</Height>
        <Container></Container>
      </Package>
    </RateV4Request>`;
  }

  private orderToPackage(order: Order): Package {
    const pounds = order.books.reduce(
      (pounds, book) => pounds + book.pounds,
      0
    );
    const ounces = order.books.reduce(
      (ounces, book) => ounces + book.ounces,
      0
    );
    const length = order.books.reduce(
      (length, book) => (book.length > length ? book.length : length),
      0
    );
    const width = order.books.reduce(
      (width, book) => (book.width > width ? book.width : width),
      0
    );
    const height = order.books.reduce(
      (height, book) => (book.height > height ? book.height : height),
      0
    );
    const pkg: Package = {
      zipOrigination: this.zipOrigination,
      zipDestination: order.customer.address.zip,
      pounds,
      ounces,
      length,
      width,
      height,
    };
    return pkg;
  }

  private xmlToObj(xml: string): UspsRateResponse {
    const options = {
      arrayMode: false,
    } as const;
    const tObj = parser.getTraversalObj(xml, options);
    const rateResponse: UspsRateResponse = parser.convertToJson(tObj, options);
    return rateResponse;
  }
}
