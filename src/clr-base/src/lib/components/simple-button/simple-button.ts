/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LitElement, html, css } from 'lit-element';

export const SIMPLE_BUTTON_TAG_NAME = 'simple-button';

export const styles = css`
  :host {
    display: block;
    contain: content;
    max-width: 500px;
    margin: 0 auto;
    border-radius: 8px;
    transition: transform 0.2s ease-out;
  }

  :host([hidden]) {
    display: none;
  }

  button,
  span {
    font-size: 1rem;
    font-family: monospace;
    padding: 0.25rem 0.5rem;
  }

  button {
    cursor: pointer;
    background: var(--global-button-color, purple);
    color: var(--global-button-font-color, black);
    border: 0;
    border-radius: 6px;
    box-shadow: 0 0 5px rgba(173, 61, 85, 0.5);
  }

  button:active {
    background: #ad3d55;
    color: white;
  }

  .bright {
    color: #ffa500;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
`;

(function() {
  class SimpleButton extends LitElement {
    static get styles() {
      return styles;
    }

    constructor() {
      super();
      console.log('in simple buttons constructor');
    }

    firstUpdated() {
      console.log('in simple buttons firstUpdated');
    }

    inCssVarsLoop = false;

    updated() {
      console.log('in simple buttons updated');
    }

    render() {
      const myTemplate = html`
        <span class="bright">My LIT ELEMENT lives here</span>
        <button type="button">This is a button</button>
      `;

      return myTemplate;
    }
  }

  window.customElements.define(SIMPLE_BUTTON_TAG_NAME, SimpleButton);
})();
