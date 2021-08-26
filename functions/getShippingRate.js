const parser = require('fast-xml-parser');
const fetch = require('node-fetch');
const https = require('https');
const zlib = require('zlib');
const qs = require('querystring');

exports.PostalService = class PostalService {
  url = 'https://secure.shippingapis.com/ShippingAPI.dll';
  zipOrigination = '29445';

  /**
   * @param order: {zipDestination: string, books: Book[]}
   */
  getShippingRate(order, cb) {
    const pkg = this._orderToPackage(order);
    const xml = this._rateXml(pkg).trim();
    // const params = new HttpParams().set('API', 'RateV4').set('XML', xml);
    const params = qs.stringify({ API: 'RateV4', XML: xml });
    // return https.get({ url: `${this.url}?${params}` }, (response) => {
    //   console.log(response);
    //   const uspsObj = this._xmlToObj(response.body);
    //   const shippingRate = uspsObj.RateV4Response.Package.Postage.Rate;
    //   return shippingRate;
    // });
    return fetch(`${this.url}?${params}`, {
      responseType: 'text',
      // params: { API: 'RateV4', XML: xml },
    }).then((response) => {
      const buffer = [];
      response.body.on('data', (data) => {
        buffer.push(data.toString());
      });
      response.body.on('end', () => {
        const uspsObj = this._xmlToObj(buffer.join(''));
        console.log(uspsObj);
        const shippingRate = uspsObj.RateV4Response.Package.Postage.Rate;
        return cb(shippingRate);
      });
    });
    // return this.http
    //   .get(this.url, {
    //     responseType: 'text',
    //     params,
    //   })
    // .pipe(
    //   map((xmlResponse) => {
    //     const uspsObj = this._xmlToObj(xmlResponse);
    //     const shippingRate = uspsObj.RateV4Response.Package.Postage.Rate;
    //     return shippingRate;
    //   })
    // )
  }

  _rateXml(pkg) {
    return `<RateV4Request_USERID="708LITTL4773">
      <Revision>2</Revision>
      <Package_ID="0">
        <Service>PRIORITY</Service>
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

exports.handler = async (req) => {
  // const order = JSON.parse(req.body);
  // const postalService = new PostalService();
  // const shippingRate = await postalService.getShippingRate(order);
  // return {
  //   statusCode: 200,
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ shippingRate }),
  // };
};
