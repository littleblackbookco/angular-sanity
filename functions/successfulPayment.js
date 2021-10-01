const { webhooks } = require('stripe');
const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
});

const getOrder = async (paymentId) => {
  const query = `*[_type=='order' && paymentId=='${paymentId}']`;
  const results = await sanity.fetch(query);
  const order = results[0];
  if (order == undefined) {
    throw new Error(`No order found with paymentId: ${paymentId}`);
  }
  return order;
};

exports.handler = async (req) => {
  let event;
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
    const paymentIntent = event.data.object;
    const paymentId = paymentIntent.id;
    const order = await getOrder(paymentId);
    await sanity.patch(order._id).set({ paid: true }).commit();
    order.items.forEach((item) =>
      sanity.patch(item.book._key).dec({ quantity: item.quantity }).commit()
    );
    return {
      statusCode: 200,
    };
  }

  console.log(`Unhandled event type ${event.type}`);
};
