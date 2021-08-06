import { useState, useEffect } from "react";
import { useDocumentOperation } from "@sanity/react-hooks";
export function HelloWorldAction(props) {
  if (props.type !== "order") {
    return null;
  }
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false);
    }
  }, [props.draft]);
  return {
    disabled: publish.disabled,
    label: "Set Order As Shipped",
    onHandle: () => {
      setIsPublishing(true);
      patch.execute([{ set: { shipped: true } }]);
      publish.execute();
      props.onComplete();
    },
  };
}
