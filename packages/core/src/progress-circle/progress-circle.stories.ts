/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@clr/core/progress-circle/register.js';
import { getElementStorybookArgTypes, spreadProps, getElementStorybookArgs } from '@clr/core/internal';
import { html } from 'lit-html';
import customElements from '../../dist/core/custom-elements.json';

export default {
  title: 'Components/Circular Progress/Stories',
  component: 'cds-progress-circle',
  argTypes: getElementStorybookArgTypes('cds-progress-circle', customElements),
  parameters: {
    options: { showPanel: true },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/v2mkhzKQdhECXOx8BElgdA/Clarity-UI-Library---light-2.2.0?node-id=51%3A673',
    },
  },
};

export const API = (args: any) => {
  return html` <cds-progress-circle ...="${spreadProps(getElementStorybookArgs(args))}"></cds-progress-circle> `;
};

export const spinner = () => {
  return html`
    <p>OHAI</p>
    <p><cds-progress-circle status="info"></cds-progress-circle></p>
  `;
};

export const status = () => {
  return html`
    <cds-progress-circle status="info" value="15"></cds-progress-circle>
    <cds-progress-circle status="info" value="75"></cds-progress-circle>
  `;
};

export const withIcon = () => {
  return html`
    <cds-progress-circle value="42" status="info">
      <cds-icon shape="unknown"></cds-icon>
    </cds-progress-circle>
  `;
};

// export const custom = () => {
//   return html`
//     <style>
//       cds-progress-circle.app-custom {
//         --background: darkblue;
//         --color: snow;
//       }

//       cds-progress-circle.app-custom-2 {
//         --background: fuchsia;
//         --color: snow;
//         --border-color: rgba(255, 255, 255, 0.7);
//         --border-width: 0.1rem;
//         --font-size: 0.7rem;
//         --font-weight: bold;
//         --size: 1.4rem;
//         --padding: 0.1rem 0.3rem;
//       }

//       cds-progress-circle.app-custom-3 {
//         --background: limegreen;
//         --color: darkgreen;
//         --border-color: darkgreen;
//         --border-width: 0.1rem;
//         --font-size: 0.7rem;
//         --font-weight: bolder;
//         --size: 1.4rem;
//         --padding: 0.1rem 0.3rem;
//       }
//     </style>
//     <p><cds-progress-circle class="app-custom"></cds-progress-circle></p>
//     <p><cds-progress-circle class="app-custom-2"></cds-progress-circle></p>
//     <p><cds-progress-circle class="app-custom-3"></cds-progress-circle></p>
//   `;
// };
