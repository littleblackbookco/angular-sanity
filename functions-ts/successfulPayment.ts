import { Stripe } from 'stripe';
import sanityClient from '@sanity/client';
import { Handler } from '@netlify/functions';

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
});

const webhooks = new Stripe.Webhooks();
const getOrder = async (paymentId: any) => {
  const query = `*[_type=='order' && paymentId=='${paymentId}']`;
  const results = await sanity.fetch(query);
  const order = results[0];
  if (order == undefined) {
    throw new Error(`No order found with paymentId: ${paymentId}`);
  }
  return order;
};

const handler: Handler = async (req) => {
  let event: Stripe.Event;
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_PAYMENT_SUCCESS_WEBHOOK_KEY;
  try {
    event = webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (e) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${e.message}`,
    };
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const paymentId = paymentIntent.id;
    const order = await getOrder(paymentId);
    await sanity.patch(order._id).set({ paid: true }).commit();
    order.items.forEach(
      (item: {
        book: { _key: string | ({ query: string } | { id: string }) };
        quantity: any;
      }) =>
        sanity.patch(item.book._key).dec({ quantity: item.quantity }).commit()
    );
    return {
      statusCode: 200,
    };
  }

  return {
    statusCode: 400,
    body: `Webhook Error: Unhandled event type ${event.type}`,
  };
};

export { handler };
