import defaultResolve from "part:@sanity/base/document-actions";
import { SetShippingAction } from "./SetShippingAction";

export default function resolveDocumentActions(props) {
  return [...defaultResolve(props), SetShippingAction];
}
