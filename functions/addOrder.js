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
  const date = new Date();
  const datetime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  const title = `${createdCustomer.name.trim()} ${datetime}`
    .split(" ")
    .join("-");

  const order = {
    _type: "order",
    title,
    customer: {
      _type: "reference",
      _ref: createdCustomer._id,
    },
    books: [
      {
        _type: "book",
        _ref: "29590594-1127-415d-9ee1-75360a1b5ed1",
        _key: "29590594-1127-415d-9ee1-75360a1b5ed1",
      },
    ],
    shipped: false,
  };
  const response = await sanity.create(order);
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  };
};
