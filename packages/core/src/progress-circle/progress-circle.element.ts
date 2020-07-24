/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  assignSlotNames,
  baseStyles,
  hasStringPropertyChanged,
  property,
  querySlot,
  StatusTypes,
  updateEquilateralSizeStyles,
} from '@clr/core/internal';
import { CdsIcon } from '@clr/core/icon';
import { html, LitElement } from 'lit-element';
import { styles } from './progress-circle.element.css.js';
import { isNil } from 'ramda';

// START --> MOVE TO HELPER FILE

interface XyPoints {
  x: number;
  y: number;
}

// TESTME
export function pctCompleteToRadians(pctComplete?: number): number {
  // forcing a small dot if value is set to 0
  pctComplete = pctComplete === 0 ? 1 : pctComplete;
  return 360 * ((pctComplete || 30) / 100);
}

// TESTME
export function describeArc(radius: number, startAngle: number, endAngle: number): string {
  // startAngle and endAngle are flipped here becuase that enables them to draw a continuous arc...
  const start = getCartesianPointsForCircularProgress(endAngle, radius);
  const end = getCartesianPointsForCircularProgress(startAngle, radius);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

// TESTME
export function getCartesianPointsForCircularProgress(
  angleInDegrees: number,
  radius: number,
  centerPoint = 18
): XyPoints {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerPoint + radius * Math.cos(angleInRadians),
    y: centerPoint + radius * Math.sin(angleInRadians),
  };
}

// END --> MOVE TO HELPER FILE

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
 * @slot icon - Content slot for projected icon inside the progress ring
 * @cssprop --background
 * @cssprop --color
 */
export class CdsProgressCircle extends LitElement {
  private _size: string;

  @querySlot('cds-icon') protected icon: CdsIcon;

  /**
   * @type {default | info | success | warning | danger | inverse | unknown}
   * Sets the color of the badge
   */
  @property({ type: String })
  status: StatusTypes = 'default';

  /**
   * Represents the percent completed from 0 to 100.
   *
   * If undefined, the progress-circle will be represented as an indeterminate
   * progress indicator – a.k.a a "spinner".
   */
  @property({ type: Number })
  value: number;

  /**
   * Represents the thickness of the stroke of the circular progress.
   *
   * If undefined, it defaults to 3.
   */
  @property({ type: Number })
  line = 3;

  private get lineOffset() {
    return Math.ceil(this.line / 2);
  }

  // 36 is the default viewbox dimensions
  // because we are always drawing against the viewbox our radius is hardset to 18
  private get radius() {
    return 18 - this.lineOffset;
  }

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
      updateEquilateralSizeStyles(this, val);
      this.requestUpdate('size', oldVal);
    }
  }

  get path(): string {
    const startAt = 0 + this.lineOffset;

    if (this.visualizedValue !== this.value) {
      // TODO: make it funcy
      const expectedValue = this.value;
      let newVisualizedValue = this.visualizedValue;
      const howFarOff = Math.abs(expectedValue - newVisualizedValue);
      const goForward = expectedValue > newVisualizedValue;

      if (howFarOff > 9) {
        newVisualizedValue = goForward ? newVisualizedValue + 6 : newVisualizedValue - 6;
      } else if (howFarOff > 1) {
        newVisualizedValue = goForward ? newVisualizedValue + 2 : newVisualizedValue - 2;
      } else {
        newVisualizedValue = goForward ? newVisualizedValue + 1 : newVisualizedValue - 1;
      }

      if (goForward && newVisualizedValue > expectedValue) {
        newVisualizedValue = expectedValue;
      } else if (!goForward && newVisualizedValue < expectedValue) {
        newVisualizedValue = expectedValue;
      }

      if (newVisualizedValue > 100) {
        newVisualizedValue = 100;
      } else if (newVisualizedValue < 0) {
        newVisualizedValue = 0;
      }

      this.visualizedValue = newVisualizedValue;
    }

    return describeArc(this.radius, startAt, pctCompleteToRadians(this.visualizedValue));
  }

  private visualizedValue: number;

  drawPath(): string {
    const startAt = 0 + this.lineOffset;

    if (this.value > 100) {
      this.value = 100;
    }

    if (this.value < 0) {
      this.value = 0;
    }

    while (this.visualizedValue !== this.value) {
      // TODO: make it funcy
      console.log('ohai');
      const expectedValue = this.value;
      let newVisualizedValue = this.visualizedValue;
      const howFarOff = Math.abs(expectedValue - newVisualizedValue);
      const goForward = expectedValue > newVisualizedValue;

      if (howFarOff > 9) {
        newVisualizedValue = goForward ? newVisualizedValue + 1 : newVisualizedValue - 1;
      } else {
        newVisualizedValue = goForward ? newVisualizedValue + 0.1 : newVisualizedValue - 0.1;
      }

      if (goForward && newVisualizedValue > expectedValue) {
        newVisualizedValue = expectedValue;
      } else if (!goForward && newVisualizedValue < expectedValue) {
        newVisualizedValue = expectedValue;
      }

      if (newVisualizedValue > 100) {
        newVisualizedValue = 100;
      } else if (newVisualizedValue < 0) {
        newVisualizedValue = 0;
      }

      this.visualizedValue = newVisualizedValue;

      const timeoutId = setTimeout(() => {
        requestAnimationFrame(this.drawPath.bind(this));
        clearTimeout(timeoutId);
      }, 1000);
    }

    return describeArc(this.radius, startAt, pctCompleteToRadians(this.visualizedValue));
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.icon) {
      this.classList.add('has-icon');
      this.icon.size = this.size || 'sm';
      assignSlotNames([this.icon, 'icon']);
    }
    if (!isNil(this.value)) {
      this.visualizedValue = this.value;
    }
  }

  /*
    LEFTOFF
    X needs inverse styling
    ! deprecate cds-icon size classnames!

    ! SIZING
      ? can we dynamically size the icon?
      ? do we need to preserve any custom sizing? (i say 'yeah'...)

    X ANIMATION?
      - split out animation code into its own utility
      - can we handle the 0 <-> 100 value issue somewhere else?
      ! will need a visual test in storybook to randomly and rapidly throw values out
        * monkey-testing!
  */

  render() {
    return html`
      <div class="private-host" aria-hidden="true">
        ${this.icon ? html`<div class="icon-wrapper"><slot name="icon"></slot></div>` : ''}
        <div class="progress-wrapper">
          <svg
            version="1.1"
            viewBox="0 0 36 36"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            focusable="false"
          >
            <circle
              stroke-width="${this.line}"
              fill="none"
              cx="18"
              cy="18"
              r="${this.radius}"
              class="${this.value > 99 ? 'arcstroke' : 'backstroke'}"
            />
            <path d="${this.drawPath()}" class="arcstroke" stroke-width="${this.line}" fill="none" />
          </svg>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
