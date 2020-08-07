/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@clr/core/icon/register.js';
import '@clr/core/progress-circle/register.js';
import { ClarityIcons, homeIcon, nodesIcon, stopIcon, warningStandardIcon } from '@clr/core/icon';
import { getElementStorybookArgTypes, spreadProps, getElementStorybookArgs } from '@clr/core/internal';
import { html } from 'lit-html';
import customElements from '../../dist/core/custom-elements.json';

ClarityIcons.addIcons(homeIcon, nodesIcon, stopIcon, warningStandardIcon);

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
  return html` <cds-progress-circle size="xl"></cds-progress-circle> `;
};

export const status = () => {
  return html`
    <div cds-layout="horizontal gap:sm">
      <cds-progress-circle size="xl" value="12"></cds-progress-circle>
      <cds-progress-circle size="xl" status="info" value="48"></cds-progress-circle>
      <cds-progress-circle size="xl" status="success" value="72"></cds-progress-circle>
      <cds-progress-circle size="xl" status="warning" value="36"></cds-progress-circle>
      <cds-progress-circle size="xl" status="danger" value="84"></cds-progress-circle>
      <cds-progress-circle size="xl" status="unknown" value="60"></cds-progress-circle>
      <div style="background: #313131">
        <cds-progress-circle size="xl" inverse value="24"></cds-progress-circle>
      </div>
      <cds-progress-circle size="xl" value="0"></cds-progress-circle>
    </div>
  `;
};

export const withIcon = () => {
  return html`
    <div cds-layout="horizontal gap:sm">
      <cds-progress-circle value="75" size="xxl">
        <cds-icon shape="stop" solid></cds-icon>
      </cds-progress-circle>
      <cds-progress-circle value="15" size="xxl" status="info">
        <cds-icon shape="home"></cds-icon>
      </cds-progress-circle>
      <cds-progress-circle value="45" size="xxl" status="success">
        <cds-icon shape="nodes"></cds-icon>
      </cds-progress-circle>
      <cds-progress-circle value="30" size="xxl" status="warning">
        <cds-icon shape="warning-standard"></cds-icon>
      </cds-progress-circle>
      <cds-progress-circle value="60" size="xxl" status="danger">
        <cds-icon shape="stop" solid></cds-icon>
      </cds-progress-circle>
      <div style="background: #313131">
        <cds-progress-circle size="xxl" inverse value="24">
          <cds-icon shape="nodes"></cds-icon>
        </cds-progress-circle>
      </div>
    </div>
  `;
};

// TODO: hide this before final PR
export const chaos = () => {
  return html`
    <cds-progress-circle value="12" size="xl" id="pureChaos"></cds-progress-circle>
    <br />
    <button
      @click=${() => {
        setInterval(
          () =>
            document
              .getElementById('pureChaos')
              .setAttribute('value', Math.floor(Math.random() * (100 - 1)).toString()),
          500
        );
      }}
    >
      Start Me Up!
    </button>
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
