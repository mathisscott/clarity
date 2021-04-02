/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/button/register.js';
import '@cds/core/internal-components/popup/register.js';

import { getElementStorybookArgTypes } from '@cds/core/internal';
import { CdsInternalPopup } from '@cds/core/internal-components/popup';
import { html } from 'lit';
import customElements from '../../../dist/core/custom-elements.json';

export default {
  title: 'Internal Stories/Popup',
  component: 'cds-internal-popup',
  argTypes: getElementStorybookArgTypes('cds-internal-popup', customElements),
  parameters: {
    options: { showPanel: true },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/v2mkhzKQdhECXOx8BElgdA/Clarity-UI-Library---light-2.2.0?node-id=51%3A673',
    },
  },
};

// export const API = (args: any) => {
//   let initted = false;
//   const popupId = 'api-overlay';

//   return html`
//     <cds-demo popover>
//       <cds-button status="primary" type="button" @click=${showApiOverlay}>Show Overlay</cds-button>
//       <cds-internal-popup ...="${spreadProps(getElementStorybookArgs(args))}" hidden id="${popupId}">
//         <div cds-layout="p:lg" style="background: white">${args.default}</div>
//       </cds-internal-popup>
//     </cds-demo>
//   `;

//   function showApiOverlay() {
//     const myPopup = document.getElementById(popupId) as CdsInternalPopup;
//     myPopup.removeAttribute('hidden');

//     if (!initted) {
//       myPopup.addEventListener('closeChange', () => {
//         myPopup.setAttribute('hidden', '');
//       });
//       initted = true;
//     }
//   }
// };

export const test = () => {
  let initted = false;
  const popupId2 = 'ohai';
  const anchorId = 'yephai';

  function showOverlay() {
    const myAnchor = document.getElementById(anchorId);
    const myPopup = document.getElementById(popupId2) as CdsInternalPopup;

    myPopup.anchor = myAnchor;
    myPopup.removeAttribute('hidden');

    if (!initted) {
      myPopup.addEventListener('closeChange', () => {
        myPopup.setAttribute('hidden', '');
      });
      initted = true;
    }
  }

  return html` <cds-button id="${anchorId}" status="primary" type="button" @click=${showOverlay}>Show</cds-button>
    <cds-internal-popup hidden id="${popupId2}">
      <cds-internal-pointer></cds-internal-pointer>
      <div cds-layout="vertical gap:lg p:lg align:stretch">
        <h1 cds-text="section">Popup</h1>
        <p cds-text="body">
          I am a popup.
        </p>
      </div>
    </cds-internal-popup>`;
};

export const scrollTest = () => {
  let initted = false;
  const popupId2 = 'scrollhai';
  const anchorId = 'scrollhey';

  function showScrollingPopup() {
    const myAnchor = document.getElementById(anchorId);
    const myPopup = document.getElementById(popupId2) as CdsInternalPopup;

    myPopup.anchor = myAnchor;
    myPopup.removeAttribute('hidden');

    if (!initted) {
      myPopup.addEventListener('closeChange', () => {
        myPopup.setAttribute('hidden', '');
      });
      initted = true;
    }
  }

  return html` <cds-button id="${anchorId}" status="primary" type="button" @click=${showScrollingPopup}
      >Show Scrolling Popup</cds-button
    >
    <cds-internal-popup hidden id="${popupId2}">
      <div cds-layout="vertical gap:lg p:lg align:stretch">
        <h1 cds-text="section">Popup</h1>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup.
        </p>
        <p cds-text="body">
          I am a popup. I am a popup. I am a popup. I am a popup. I am a popup. I am a popup. I am a popup. I am a
          popup. I am a popup. I am a popup. I am a popup. I am a popup. I am a popup.
        </p>
      </div>
    </cds-internal-popup>`;
};
