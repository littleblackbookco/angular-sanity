export default {
  name: 'order',
  title: 'Order',
  type: 'object',
  readOnly: true,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{ type: 'customer' }],
    },
    {
      name: 'items',
      title: 'Items Ordered',
      type: 'array',
      of: [
        {
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            {
              type: 'reference',
              name: 'book',
              title: 'Book',
              weak: true,
              to: [{ type: 'book' }],
            },
            {
              name: 'quantity',
              title: 'Quantity Ordered',
              type: 'number',
              description: 'How many of this item are in the order',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'shipped',
      title: 'Shipped',
      type: 'boolean',
    },
    {
      name: 'shippedOn',
      title: 'Shipped On',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
    },
    {
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
    },
    {
      name: 'cartPrice',
      title: 'Cart Price',
      type: 'string',
    },
    {
      name: 'shippingPrice',
      title: 'Shipping Price',
      type: 'string',
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'string',
    },
    {
      name: 'paid',
      title: 'Has Been Paid?',
      type: 'boolean',
      default: false,
    },
  ],
};
