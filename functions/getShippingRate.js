const parser = require('fast-xml-parser');

class PostalService {
  url = 'https://secure.shippingapis.com/ShippingAPI.dll';
  zipOrigination = '29445';

  getShippingRate(order) {
    const pkg = this._orderToPackage(order);
    const xml = this._rateXml(pkg);
    // const params = new HttpParams().set('API', 'RateV4').set('XML', xml);
    return fetch(this.url, {
      responseType: 'text',
      params: { API: 'RateV4', XML: xml },
    }).then((response) => {
      const uspsObj = this._xmlToObj(response.body);
      const shippingRate = uspsObj.RateV4Response.Package.Postage.Rate;
      return shippingRate;
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
      zipDestination: order.customer.address.zip,
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
}

exports.handler = async (req) => {
  const order = JSON.parse(req.body);
  const postalService = new PostalService();
  const shippingRate = await postalService.getShippingRate(order);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shippingRate }),
  };
};
