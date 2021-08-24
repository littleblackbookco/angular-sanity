import defaultResolve, {
  PublishAction,
} from 'part:@sanity/base/document-actions';
import { PublishBookAction } from './PublishBookAction';
import { SetShippingAction } from './SetShippingAction';

export default function resolveDocumentActions(props) {
  return [
    ...defaultResolve(props).map((Action) =>
      props.type === 'book' && Action === PublishAction
        ? PublishBookAction
        : Action
    ),
    SetShippingAction,
  ];
}
