const sanityClient = require('@sanity/client');
const { PostalService } = require('./getShippingRate');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
});

function calculateOrderTotal(order) {
  let amount = 0;
  for (const item of order) {
    if (item.quantity > item.available) {
      throw new Error(
        `Cannot fulfill order: the amount requested (${item.quantity}) is greater than the amount available (${book.available})`
      );
    }
    amount = amount + item.price * item.quantity;
  }
  return amount;
}

async function getFromSanity(order) {
  const ids = order.map((item) => `"${item.id}"`);
  const query = `*[_type=='book' && slug.current in [${ids}]] {
    'slug': slug.current,
    price,
    quantity,
    length,
    width,
    height,
    pounds,
    ounces
  }`;
  return await sanity.fetch(query).then((books) =>
    books.map((book) => {
      const item = order.find((item) => item.id === book.slug);
      return { ...book, quantity: item.quantity, available: book.quantity };
    })
  );
}

// function validateOrder(order, books) {
//   return books.map((book) => {
//     const item = order.find((item) => item.id === book.slug);
//     return {...book, quantity: item.quantity, available: book.quantity}
//   })
// }

exports.handler = async (req) => {
  /** {zipDestination: string, items: { id: string, quantity: number}[]} */
  try {
    const data = JSON.parse(req.body);
    const books = await getFromSanity(data.items);
    const orderTotal = calculateOrderTotal(books);
    const postalService = new PostalService();
    // let shippingRate = 0;
    const shippingRate = await new Promise((resolve, reject) => {
      try {
        postalService.getShippingRate(
          {
            zipDestination: data.zipDestination,
            books,
          },
          (shippingRate) => resolve(shippingRate)
        );
      } catch (e) {
        reject(e.message);
      }
    });
    console.log('shippingRate', shippingRate);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil((orderTotal + shippingRate) * 100),
      currency: 'usd',
    });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };

    // console.log('wat', wat);
    // console.log('shippingRate', shippingRate);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: orderTotal + shippingRate,
    //   currency: 'usd',
    // });
    // return {
    //   statusCode: 200,
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    // };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
