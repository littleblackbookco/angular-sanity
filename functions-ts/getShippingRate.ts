import { Handler } from '@netlify/functions';
import { PostalService } from './postal-service';

const handler: Handler = async (req) => {
  try {
    const order = JSON.parse(req.body);
    const postalService = new PostalService();
    const shippingRate = await new Promise((resolve, reject) => {
      try {
        postalService.getShippingRate(
          {
            zipDestination: order.customer.address.zip,
            books: order.books,
          },
          (shippingRate: number) => resolve(shippingRate)
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
};

export { handler };
