export default {
  name: 'bookImage',
  type: 'object',
  title: 'Image',
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description:
        "This will be used for 'alt' text. Read more here: https://accessibility.huit.harvard.edu/describe-content-images",
    },
  ],
};
