export default {
  name: "book",
  title: "Books",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Book Title",
      type: "string",
      description:
        "This doesn't have to be the actual book title, just whatever you want to call it",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description:
        "This will be a unique ID used to build the URL to view this book",
    },
    {
      name: "description",
      title: "Book Description",
      type: "richText",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Tags are used for grouping similar books together",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "bookImage" }],
    },
    {
      name: "videos",
      title: "Videos",
      type: "array",
      of: [{ type: "bookVideo" }],
    },
  ],
};
