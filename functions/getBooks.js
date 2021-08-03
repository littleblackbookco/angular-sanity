const sanityClient = require("@sanity/client");
const blocksToHtml = require("@sanity/block-content-to-html");

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
  const books = await sanity.fetch(query).then((results) => {
    const allBooks = results.map((book) => {
      const output = {
        id: book.slug.current,
        name: book.title,
        url: `${process.env.URL}/.netlify/functions/getBooks`,
        price: book.price,
        quantity: book.quantity,
        tags: book.tags,
        description: blocksToHtml({ blocks: book.description }),
        videos: book.videos,
      };

      // if (book.images && book.images.length > 0) {
      //   const images = book.images.map((image) => {
      //     const ref = image.asset._ref;
      //     return imageUrlBuilder(sanity).image(ref).url();
      //   });
      //   output.images = images;
      // }

      // if (book.videos && book.videos.length > 0) {
      //   const videos = book.videos.map((video) => {
      //     const ref = video.asset._ref;
      //     return imageUrlBuilder(sanity).image(ref).url();
      //   });
      //   output.videos = videos;
      // }

      return output;
    });
    console.log(allBooks);
    return allBooks;
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(books),
  };
};
