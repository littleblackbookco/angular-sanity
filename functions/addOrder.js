const sanityClient = require('@sanity/client');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
});

const createCustomer = async (customerData) => {
  const customer = {
    _id: customerData.email.replaceAll('@', '-').replaceAll('.', '-'),
    _type: 'customer',
    name: customerData.name,
    email: customerData.email,
    address: customerData.address,
  };

  const sanityCustomer = await sanity.createIfNotExists(customer);
  return sanityCustomer;
};

const getBookQuantity = async (book) => {
  const query = `*[_type=='book' && _id=='${book._id}'] { quantity }`;
  const results = await sanity.fetch(query);
  try {
    const quantity = results[0].quantity;
    return quantity;
  } catch (e) {
    throw new Error(
      `Could not get available quantity for book ${book.title}: ${e.message}`
    );
  }
};

const validateOrder = async (books) => {
  // create an object that maps book id to the quantity in the order
  // example: { "some-book-id": 2 } would mean that "some-book-id" was seen 2
  // times in the order
  const orderQuantity = books.reduce((prev, book) => {
    if (prev[book._id] === undefined) {
      const newQuanity = { ...prev };
      newQuanity[book._id] = 1;
      return newQuanity;
    } else {
      const newQuanity = { ...prev };
      newQuanity[book._id] = newQuanity[book._id] + 1;
      return newQuanity;
    }
  }, {});
  // create an object with the same idea as above, which we use later to
  // validate that the order quantity for a book doesn't exceed the quantity
  // available
  const storeQuantity = {};

  // keep an array of book ids found in the order so that we don't send a query
  // for a book that we've already seen (in case the order contains duplicates
  // of the same book)
  const bookIds = [];

  for (book of books) {
    // if the id is already in bookIds, we've seen it before so don't send the
    // query
    if (bookIds.includes(book._id)) {
      continue;
    } else {
      const available = await getBookQuantity(book);
      storeQuantity[book._id] = available;
      bookIds.push(book._id);
    }
  }

  const isValid = Object.keys(orderQuantity).reduce((isValid, bookId) => {
    // if the order has already been determined as invalid, return false
    if (!isValid) {
      return isValid;
    } else {
      return orderQuantity[bookId] <= storeQuantity[bookId];
    }
  }, true);

  if (isValid) {
    Object.entries(orderQuantity).forEach(([bookId, amount]) => {
      sanity.patch(bookId).dec({ quantity: amount }).commit();
    });
  }

  return isValid;
};

const createOrder = async (sanityCustomer, books) => {
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
    books: books.map((book) => ({
      _type: book._type,
      _ref: book._id,
      _key: book._id,
    })),
    shipped: false,
  };
  const response = await sanity.create(order);
  return response;
};

exports.handler = async (event) => {
  const body = JSON.parse(event.body, (key, value) => {
    if (!key.startsWith('_') && typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  });
  const { customer, books } = body;
  const sanityCustomer = await createCustomer(customer);
  if (await validateOrder(books)) {
    const sanityOrder = await createOrder(sanityCustomer, books);
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanityOrder),
    };
  }
  return {
    statusCode: 409,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Your order is invalid' }),
  };
};
