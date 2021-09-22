import { PostalService } from '../helpers/postal.service';

export async function handler(req) {
  try {
    const order = JSON.parse(req.body);
    const shippingRate = await new Promise((resolve, reject) => {
      try {
        const postalService = new PostalService();
        postalService.getShippingRate(
          {
            zipDestination: order.customer.address.zip,
            books: order.books,
          },
          (shippingRate) => resolve(shippingRate)
        );
      } catch (e) {
        reject(e.message);
      }
    });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shippingRate }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e }),
    };
  }
}
