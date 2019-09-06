/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LitElement, html, css, property } from 'lit-element';
import { styles } from './styles';

// @dynamic
export class ClrWcElement extends LitElement {
  @property({ type: Boolean })
  visible = false;
  @property({ type: String })
  title = 'dropdown';

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <div class="dropdown">
        <button @click="${() => this.toggle()}" class="btn">${this.title}</button>
        ${
          this.visible
            ? html`
            <div>
              <slot></slot>
            </div>`
            : ''
        }
      </div>
    `;
  }

  toggle() {
    this.visible = !this.visible;
    this.dispatchEvent(new CustomEvent('visibleChange', { detail: this.visible }));
  }
}

customElements.define('clr-wc-element', ClrWcElement);
