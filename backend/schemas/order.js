export default {
  name: "order",
  title: "Order",
  type: "object",
  fields: [
    {
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
    },
    {
      name: "books",
      title: "Book(s) Ordered",
      type: "array",
      of: [
        {
          type: "reference",
          name: "book",
          title: "Book",
          weak: true,
          to: [{ type: "book" }],
        },
      ],
    },
    {
      name: "shipped",
      title: "Shipped",
      type: "boolean",
    },
  ],
};
