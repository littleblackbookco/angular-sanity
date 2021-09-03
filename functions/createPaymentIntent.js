const sanityClient = require('@sanity/client');
const { PostalService } = require('./getShippingRate');
const { createCustomer } = require('./addOrder');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
});

const calculateOrderTotal = (order) => {
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
};

const getFromSanity = async (order) => {
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
};

async function createPayment(email, paymentId, amount) {
  const payment = {
    _type: 'payment',
    customerId: email.replaceAll('@', '-').replaceAll('.', '-'),
    paymentId,
    amount,
    paid: false,
  };
  return await sanity.create(payment);
}

exports.handler = async (req) => {
  try {
    /**
     * {
     *   customer: { contact: {}, address: {} },
     *   items: { id: string, quantity: number}[]
     * }
     */
    const data = JSON.parse(req.body);
    const { customer, items } = data;
    const books = await getFromSanity(items);
    const orderTotal = calculateOrderTotal(books);
    const postalService = new PostalService();
    const shippingRate = await new Promise((resolve, reject) => {
      try {
        postalService.getShippingRate(
          {
            zipDestination: customer.address.zip,
            books,
          },
          (shippingRate) => resolve(shippingRate)
        );
      } catch (e) {
        reject(e);
      }
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil((orderTotal + shippingRate) * 100),
      currency: 'usd',
    });
    await createPayment(
      customer.contact.email,
      paymentIntent.id,
      paymentIntent.amount
    );
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
