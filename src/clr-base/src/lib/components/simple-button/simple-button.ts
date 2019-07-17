/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

interface ShadyWindow extends Window {
  ShadyCSS: any;
}

(function() {
  const template = document.createElement('template');

  template.innerHTML = `
    <style>
      :host {
        all: initial;
        display: inline-block;
        contain: content;
        max-width: 500px;
        margin: 0 auto;
        border-radius: 8px;
        transition: transform .2s ease-out;
      }

      :host([hidden]) {
        display: none;
      }

      button,
      span {
        font-size: 1rem;
        font-family: monospace;
        padding: 0.25rem .5rem;
      }

      button {
        cursor: pointer;
        background: var(--global-button-color, red);
        color: var(--global-button-font-color, black);
        border: 0;
        border-radius: 6px;
        box-shadow: 0 0 5px rgba(173, 61, 85, .5);
      }

      button:active {
        background: #ad3d55;
        color: white;
      }
    </style>
    <button type="button">This is a button</button>
  `;

  // Use polyfill only in browsers that lack native Shadow DOM.
  if ((window as ShadyWindow).ShadyCSS) {
    (window as ShadyWindow).ShadyCSS.prepareTemplate(template, 'simple-button', 'div');
  }

  class MyElement extends HTMLElement {
    private _loaded = false;

    connectedCallback() {
      if (!this._loaded) {
        // this.innerHTML = "<p>Ohai</p>";

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._loaded = true;
      }
    }
  }

  window.customElements.define('simple-button', MyElement);
})();
