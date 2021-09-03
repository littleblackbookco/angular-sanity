export default {
  name: 'payment',
  title: 'Payment',
  type: 'object',
  readOnly: true,
  fields: [
    {
      name: 'customerId',
      title: 'Customer ID',
      type: 'string',
    },
    {
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
    },
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
    },
    {
      name: 'paid',
      title: 'Has Been Paid?',
      type: 'boolean',
      default: false,
    },
  ],
};
