const { PostalService } = require('./postal.service');
const sanityClient = require('@sanity/client');
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
    _id,
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

const createCustomer = async (customerData) => {
  const customer = {
    _id: customerData.contact.email.replaceAll('@', '-').replaceAll('.', '-'),
    _type: 'customer',
    name: customerData.contact.name,
    email: customerData.contact.email,
    address: customerData.address,
  };

  const sanityCustomer = await sanity.createIfNotExists(customer);
  return sanityCustomer;
};

const createOrder = async (sanityCustomer, items, books, payment) => {
  const date = new Date();
  const datetime = `${date.toLocaleDateString()} ${date
    .toLocaleTimeString()
    .split(' ')
    .join('')}`;
  const title = `${sanityCustomer.name.trim().split(' ').join('_')} ${datetime}`
    .split(' ')
    .join('--');
  const order = {
    _type: 'order',
    title,
    customer: {
      _type: 'reference',
      _ref: sanityCustomer._id,
    },
    items: items.map((item) => {
      const book = books.find((book) => book.slug === item.id);
      const merge = {
        _key: item.id,
        quantity: item.quantity,
        book: {
          _type: book._type,
          _ref: book._id,
          _key: book._id,
        },
      };
      return merge;
    }),
    shipped: false,
    paymentId: payment.id,
    cartPrice: `$${payment.cartPrice}`,
    shippingPrice: `$${payment.shippingPrice}`,
    totalPrice: `$${payment.totalPrice}`,
    paid: false,
  };
  const response = await sanity.create(order);
  return response;
};

/**
 * @param items: {id: string, quantity: number}[]
 * @param books: Book[]
 * @returns boolean
 */
const validateQuantity = (items, books) => {
  const isValid = items.reduce((isValid, item) => {
    // if the order has already been determined as invalid, return false
    if (!isValid) {
      return isValid;
    } else {
      const book = books.find((book) => book.slug === item.id);
      return item.quantity <= book.quantity;
    }
  }, true);
  return isValid;
};

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
    if (validateQuantity(items, books)) {
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
        amount: Math.floor((orderTotal + shippingRate) * 100),
        currency: 'usd',
        receipt_email: customer.contact.email,
      });
      const totalPrice = orderTotal + shippingRate;
      const payment = {
        id: paymentIntent.id,
        cartPrice: orderTotal,
        shippingPrice: shippingRate,
        totalPrice,
      };
      const sanityCustomer = await createCustomer(customer);
      await createOrder(sanityCustomer, items, books, payment);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      };
    } else {
      throw new Error(
        'Order is invalid: Quantity in order exceeds quantity available in store'
      );
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
