/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { baseStyles, hasStringPropertyChanged, property, querySlot, StatusTypes } from '@clr/core/internal';
import { CdsIcon, updateIconSizeStyleOrClassnames } from '@clr/core/icon';
import { html, LitElement } from 'lit-element';
import { styles } from './progress-circle.element.css.js';

/**
 * Circular progress indicators provide a method to track how close long-running tasks are to
 * completion. Circular progress offer a compact way to track progress in a variety of situations.
 *
 * ```typescript
 * import '@clr/core/progress-circle/register.js';
 * ```
 *
 * ```html
 * <cds-progress-circle status="info" aria-label="Download progress is 50% complete" aria-live="assertive"></cds-progress-circle>
 * ```
 * @beta
 * @element cds-progress-circle
 * @slot default - Content slot for inside the badge
 * @cssprop --background
 * @cssprop --color
 */
export class CdsProgressCircle extends LitElement {
  private _size: string;

  @querySlot('cds-icon') protected icon: HTMLElement;

  /**
   * @type {default | info | success | warning | danger | inverse}
   * Sets the color of the badge
   */
  @property({ type: String })
  status: StatusTypes;

  /**
   * Represents the percent completed from 0 to 100.
   *
   * If undefined, the progress-circle will be represented as an indeterminate
   * progress indicator – a.k.a a "spinner".
   */
  @property({ type: Number })
  value: number;

  get size() {
    return this._size;
  }

  /**
   * @type {string | sm | md | lg | xl | xxl}
   * Apply numerical width-height or a t-shirt-sized CSS classname
   */
  @property({ type: String })
  set size(val: string) {
    if (hasStringPropertyChanged(val, this._size)) {
      const oldVal = this._size;
      this._size = val;
      updateIconSizeStyleOrClassnames(this.icon as CdsIcon, val);
      this.requestUpdate('size', oldVal);
    }
  }

  render() {
    return html`
      <div class="private-host">
        <span
          ><span><slot></slot></span
        ></span>
      </div>
    `;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
