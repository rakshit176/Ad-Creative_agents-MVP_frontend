// @ts-nocheck
import { observer } from 'mobx-react-lite';

import { Dialog } from '@blueprintjs/core';

export const SubscriptionModal = observer(({ onClose, isOpen }) => {

  return (
    <Dialog
      onClose={onClose}
      title="Coming soon"
      isOpen={isOpen}
      style={{
        width: '80%',
        maxWidth: '600px',
      }}
    >
     ~ Krut AI
    </Dialog>
  );
});
