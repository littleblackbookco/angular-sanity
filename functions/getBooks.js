const sanityClient = require('@sanity/client');
const blocksToHtml = require('@sanity/block-content-to-html');

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
});

exports.handler = async () => {
  const query = `*[_type=='book'] {
    ...,
    images[] {
      caption,
      'url': image.asset->url
    },
    videos[] {
      asset-> {
      'url': 'https://stream.mux.com/' + playbackId 
      }
    }
  }`;
  const books = await sanity.fetch(query).then((results) =>
    results.map((book) => ({
      ...book,
      slug: book.slug.current,
      description: blocksToHtml({ blocks: book.description }),
    }))
  );

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(books),
  };
};
