/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LitElement, html } from 'lit-element';
import { styles } from './styles';
import { registerElementSafely } from '../../utils/common/safe-register';
import { isNil } from 'ramda';

let idPlaceholder = 0;

enum IconEvents {
  ShapeChanged = 'shape-changed',
}

// make a helper...
function getCustomEvent(name: string, detail: {}): Event {
  return new CustomEvent(name, detail);
}

function iconEventEmitter(eventName: string, icon: ClrIcon) {
  let event: Event;
  const detail = { icon: icon };

  switch (eventName) {
    case IconEvents.ShapeChanged:
      event = getCustomEvent(IconEvents.ShapeChanged, {
        message: `Icon (${icon.id}) has changed its shape`,
        detail: detail,
      });
      break;
    default:
      break;
  }
  return event;
}

// @dynamic
export class ClrIcon extends LitElement {
  _shape: string;
  _size: string | number;

  static get properties() {
    return {
      shape: { type: String },
      size: { type: String }, // will convert between numerical values and TShirt sizes
      title: { type: String },
      id: { type: String },
    };
  }

  static get styles() {
    return styles;
  }

  // including null/undefined breaks API
  set shape(val: string) {
    if (!isNil(val)) {
      const oldVal = this._shape;
      this._shape = val;
      this.requestUpdate('shape', oldVal).then(() => {
        this.dispatchEvent(iconEventEmitter(IconEvents.ShapeChanged, this));
      });
    }
  }

  // can use @property here?
  get shape() {
    return this._shape;
  }

  set size(val: string | number) {
    // if string and also t-shirt size, then set classname
    // if number then kill classname and set inline styles
    // if neither then no-op

    // you'll want to trim val
    // val = val.trim();
    // then test that it is !isNaN and also that it is not an empty string
    // if it's a string, test it against known values
    // the number path will remove icon size classnames and add equilateral inline styles
    // the string path will remove equilateral inline styles and add icon size classnames (clearing out existing classnames)
    // all these should probably be their own functions...
    const oldVal = this._size;
    this._size = val;
    this.requestUpdate('size', oldVal);
  }

  get size() {
    return this._size;
  }

  constructor() {
    super();
    this._shape = 'unknown';
    this.id = 'my-custom-icon' + idPlaceholder++;
    this.size = 'medium';
    this.title = 'Unknown Icon';
  }

  // get/set shape. we want to make sure shape change is fired
  // also blacklist harmful html and styling options

  // need _shape pulled from icon registry

  // appendCustomTitle

  // setSize

  // normalizeShape

  render() {
    return html`
      OHAI! ${this.shape}
    `;
  }
}

registerElementSafely('clr-wc-icon', ClrIcon);
