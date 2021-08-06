const sanityClient = require("@sanity/client");

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
});

exports.handler = async () => {
  const customer = {
    _type: "customer",
    name: "David Brady",
    email: "dgrbrady@gmail.com",
    address: "Ladson, SC",
  };
  const createdCustomer = await sanity.create(customer);
  const order = {
    _type: "order",
    customer: createdCustomer._id,
    books: ["29590594-1127-415d-9ee1-75360a1b5ed1"],
    shipped: false,
  };
  const response = await sanity.create(order);
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  };
};
