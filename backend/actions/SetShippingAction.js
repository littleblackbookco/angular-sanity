import { useDocumentOperation } from "@sanity/react-hooks";
export function SetShippingAction(props) {
  if (props.type !== "order") {
    return null;
  }
  const order = props.published;
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  return {
    disabled: order.shipped,
    label: "Set Order As Shipped",
    onHandle: () => {
      const shippedDate = new Date().toISOString();
      const [date, time] = shippedDate.split("T");
      patch.execute([
        {
          set: {
            shipped: true,
            shippedOn: date,
          },
        },
      ]);
      publish.execute();
      props.onComplete();
    },
  };
}
