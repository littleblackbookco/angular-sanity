import { useState, useEffect } from 'react';
import { useDocumentOperation } from '@sanity/react-hooks';
import { useToast } from '@sanity/ui';

function shouldSendToNetlify(publishedBook, draftedBook) {
  // if there is a difference in the two books for any of these properties,
  // we need to update the product in Sanity by sending to Netlify function
  const targetKeys = [
    'slug',
    'price',
    'width',
    'length',
    'height',
    'pounds',
    'ounces',
    'title',
    'quantity',
  ];
  return targetKeys.reduce((different, key) => {
    // if we already found a difference, just return true
    if (different) {
      return true;
    }
    // the slug property is actually an object and the value we need to
    // compare is book.slug.current
    if (key === 'slug') {
      return publishedBook[key].current !== draftedBook[key].current;
    }
    return publishedBook[key] !== draftedBook[key];
  }, false);
}
export function PublishBookAction(props) {
  if (props.type !== 'book') {
    return null;
  }
  const draftedBook = props.draft;
  const publishedBook = props.published ?? {};
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [isPublishing, setIsPublishing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false);
    }
  }, [props.draft]);

  return {
    disabled: publish.disabled,
    label: isPublishing ? 'Publishing...' : 'Publish',
    onHandle: async () => {
      setIsPublishing(true);
      console.log(props);
      if (shouldSendToNetlify(publishedBook, draftedBook)) {
        try {
          const functionsUrl = process.env.SANITY_STUDIO_FUNCTIONS_URL;
          const response = await fetch(`${functionsUrl}/publishBook`, {
            method: 'POST',
            body: JSON.stringify({
              ...publishedBook,
              ...draftedBook,
            }),
          });
          const json = await response.json();
          const { book, price } = json;
          draftedBook.priceId = price.id;
          const msg = {
            status: 'success',
            title: 'Product updated in Stripe',
          };
          toast.push(msg);
        } catch (e) {
          toast.push({
            status: 'error',
            title: e.message,
          });
          props.onComplete();
          throw e;
        }
      }
      patch.execute([
        {
          set: draftedBook,
        },
      ]);
      publish.execute();
      props.onComplete();
    },
  };
}
