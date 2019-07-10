/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render(){
    return html`
      <button type="button">This is a button</button>
    `;
  }
}
// Register the new element with the browser.
customElements.define('simple-button', MyElement);

