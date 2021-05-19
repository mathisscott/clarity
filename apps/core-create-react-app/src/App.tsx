import React, { useState } from 'react';

import { CdsButton } from '@cds/react/button';
import { CdsModal, CdsModalHeader, CdsModalContent, CdsModalActions } from '@cds/react/modal';
import './App.css';

export default function App() {
  const [open, setOpen] = useState(false);

  /*
  We also tried this, which tries to apply the Clarity docs in a React-idiomatic way, but it doesn't work and tends to crash the browser...

  const ref = React.useRef();

  const onCloseChange = () => {
    ref.current?.closeOverlay();
    setOpen(false);
  };
  */

  return (
    <>
      <CdsButton onClick={() => setOpen(true)}>Open modal</CdsButton>

      <CdsModal hidden={!open} /* ref={ref} onCloseChange={onCloseChange} */ onCloseChange={() => setOpen(false)}>
        <CdsModalHeader>
          <h3 cds-text="title">Title</h3>
        </CdsModalHeader>

        <CdsModalContent>
          <p cds-text="body">Content</p>
        </CdsModalContent>

        <CdsModalActions>
          <CdsButton onClick={() => setOpen(false)}>Close</CdsButton>
        </CdsModalActions>
      </CdsModal>
    </>
  );
}
