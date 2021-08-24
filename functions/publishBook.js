require('dotenv').config();
const Stripe = require('stripe');
// import Stripe from 'stripe';

function getPackageDimensions(book) {
  const { width, height, length, pounds, ounces } = book;
  return { width, height, length, weight: pounds * 16 + ounces };
}

function setupResponse() {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.SANITY_STUDIO_HOST,
  };
  const headers = { 'Content-Type': 'application/json', ...corsHeaders };
  const response = {
    headers,
  };
  return response;
}

async function createStripePrice(stripe, draftedBook) {
  const oldPrice = await stripe.prices.retrieve(draftedBook.priceId);

  return oldPrice.unit_amount === draftedBook.price * 100
    ? oldPrice
    : await stripe.prices.create({
        currency: 'usd',
        product: draftedBook.slug.current,
        unit_amount: draftedBook.price * 100,
        billing_scheme: 'per_unit',
        lookup_key: draftedBook.slug.current,
        transfer_lookup_key: true,
      });
}

async function updateBookProduct(stripe, draftedBook) {
  const book = await stripe.products.update(draftedBook.slug.current, {
    metadata: { quantity: draftedBook.quantity },
    package_dimensions: getPackageDimensions(draftedBook),
    active: !!draftedBook.quantity,
    name: draftedBook.title,
  });
  const price = await createStripePrice(stripe, draftedBook);
  return [book, price];
}

async function createBookProduct(stripe, draftedBook) {
  const book = await stripe.products.create({
    id: draftedBook.slug.current,
    name: draftedBook.title,
    url: `https://littleblackbookco.store/books/${draftedBook.slug.current}`,
    type: 'good',
    package_dimensions: getPackageDimensions(draftedBook),
    shippable: true,
    tax_code: 'txcd_99999999',
    metadata: { quantity: draftedBook.quantity },
  });
  const price = await createStripePrice(stripe, draftedBook);
  return [book, price];
}

exports.handler = async (req) => {
  const response = setupResponse();
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
  const draftedBook = JSON.parse(req.body);
  let existingBook;
  try {
    existingBook = await stripe.products.retrieve(draftedBook.slug.current);
  } catch (e) {
    // if stripe returns a 404, that's fine but we want to throw any other err
    if (e.statusCode !== 404) {
      throw e;
    }
  }
  try {
    const [book, price] = existingBook
      ? await updateBookProduct(stripe, draftedBook)
      : await createBookProduct(stripe, draftedBook);
    response.statusCode = 201;
    response.body = JSON.stringify({ book, price });
    return response;
  } catch (e) {
    response.statusCode = e.statusCode || 500;
    response.body = JSON.stringify({ error: e.message });
    return response;
  }
};
