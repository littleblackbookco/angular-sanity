import defaultResolve from "part:@sanity/base/document-actions";
import { HelloWorldAction } from "./HelloWorldAction";

export default function resolveDocumentActions(props) {
  return [...defaultResolve(props), HelloWorldAction];
}
