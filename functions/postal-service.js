const parser = require('fast-xml-parser');
const fetch = require('node-fetch');
const qs = require('querystring');

exports.PostalService = class {
  url = 'https://secure.shippingapis.com/ShippingAPI.dll';
  zipOrigination = '29445';

  /**
   * @param order: {zipDestination: string, books: Book[]}
   */
  async getShippingRate(order, cb) {
    const pkg = this._orderToPackage(order);
    const xml = this._rateXml(pkg).trim();
    const params = qs.stringify({ API: 'RateV4', XML: xml });

    const response = await fetch(`${this.url}?${params}`, {
      responseType: 'text',
    });
    const buffer = [];
    response.body.on('data', (data) => {
      buffer.push(data.toString());
    });
    response.body.on('end', () => {
      const uspsObj = this._xmlToObj(buffer.join(''));
      let shippingRate;
      // netlify functions do not support elvis operator

      if (
        uspsObj &&
        uspsObj.RateV4Response &&
        uspsObj.RateV4Response.Package &&
        uspsObj.RateV4Response.Package.Postage &&
        uspsObj.RateV4Response.Package.Postage.Rate
      ) {
        shippingRate = uspsObj.RateV4Response.Package.Postage.Rate;
      }
      console.log('shippingRate INSIDE: ', shippingRate);
      return cb(shippingRate);
    });
  }

  _rateXml(pkg) {
    // possible service values are LIBRARY or MEDIA
    return `<RateV4Request_USERID="708LITTL4773">
      <Revision>2</Revision>
      <Package_ID="0">
        <Service>LIBRARY</Service>
        <ZipOrigination>${this.zipOrigination}</ZipOrigination>
        <ZipDestination>${pkg.zipDestination}</ZipDestination>
        <Pounds>${pkg.pounds}</Pounds>
        <Ounces>${pkg.ounces}</Ounces>
        <Container></Container>
        <Width>${pkg.width + 1}</Width>
        <Length>${pkg.length + 1}</Length>
        <Height>${pkg.height + 1}</Height>
      </Package>
    </RateV4Request>`
      .replace(/\s/g, '')
      .replace(/_/g, ' ');
  }

  _orderToPackage(order) {
    const pounds = order.books.reduce(
      (pounds, book) => pounds + book.pounds * book.quantity,
      0
    );
    const ounces = order.books.reduce(
      (ounces, book) => ounces + book.ounces * book.quantity,
      0
    );
    // use the highest length found in the books array
    const length = order.books.reduce(
      (length, book) => (book.length > length ? book.length : length),
      0
    );
    // use the highest width found in the books array
    const width = order.books.reduce(
      (width, book) => (book.width > width ? book.width : width),
      0
    );
    // add all the heights together
    const height = order.books.reduce(
      (height, book) => height + book.height,
      0
    );
    const pkg = {
      zipOrigination: this.zipOrigination,
      zipDestination: order.zipDestination,
      pounds,
      ounces,
      length,
      width,
      height,
    };
    return pkg;
  }

  _xmlToObj(xml) {
    const options = {
      arrayMode: false,
    };
    const tObj = parser.getTraversalObj(xml, options);
    const rateResponse = parser.convertToJson(tObj, options);
    return rateResponse;
  }
};
