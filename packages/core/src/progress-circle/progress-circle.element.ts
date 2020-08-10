/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  addClassnames,
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
   * @type {default | info | success | warning | danger | unknown}
   * Sets the color of the badge
   */
  @property({ type: String })
  status: StatusTypes | 'unknown' | 'inverse' = 'default';

  /**
   * Inverts color of circular progress bar if `true`.
   * Useful for displaying icons on a dark background.
   */
  @property({ type: Boolean })
  inverse = false;

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
      console.log('ohai: ', this.visualizedValue, '; time? ', Date.now().toString());
      const expectedValue = this.value;
      let newVisualizedValue = this.visualizedValue;
      const howFarOff = Math.abs(expectedValue - newVisualizedValue);
      const goForward = expectedValue > newVisualizedValue;

      if (howFarOff > 9) {
        newVisualizedValue = goForward ? newVisualizedValue + 1 : newVisualizedValue - 0.0125;
      } else {
        newVisualizedValue = goForward ? newVisualizedValue + 0.1 : newVisualizedValue - 0.0125;
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

      // LEFTOFF: it appears the while loop is mashing our timing function. we should
      // do a time-delay check to make sure that the while loop is only executing on
      // the next anticipated frame...

      // requestAnimationFrame(this.drawPath.bind(this));
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(this.drawPath.bind(this));
        clearTimeout(timeoutId);
      }, 1000 / 60);
    }

    return describeArc(this.radius, startAt, pctCompleteToRadians(this.visualizedValue));
  }

  private dynamicIconSize = false;

  // TODO: MAKE IT FUNCY
  sizeIcon(icon: CdsIcon) {
    // all sizes related to the progress circle are relative to the 36 x 36 viewbox
    const viewBoxDimensions = 36;
    const containerDimensions = this.clientHeight;
    const arcLineThickness = this.line;
    // let sizedNudge = 8;
    const versusViewBoxRatio = containerDimensions / viewBoxDimensions;

    // if (containerDimensions < 17) {
    //   sizedNudge = 1;
    // } else if (containerDimensions < 25) {
    //   sizedNudge = arcLineThickness > 5 ? 1 : 2;
    // } else if (containerDimensions < 37) {
    //   sizedNudge = arcLineThickness > 5 ? 2 : 4;
    // } else if (containerDimensions < 65) {
    //   sizedNudge = arcLineThickness > 7 ? 2 : 6;
    // };

    const lineOnAxis = 2 * (versusViewBoxRatio * arcLineThickness);
    const nudge = 2 * (versusViewBoxRatio * 6);
    icon.size = Math.floor(this.clientHeight - lineOnAxis - nudge) + '';
  }

  connectedCallback() {
    super.connectedCallback();

    // FIXME: this set timeout jumps outside synchronous execution to resolve after all the
    // dependencies are resolved. without it, es5 angular won't show icons inside of progress-circles
    setTimeout(() => {
      if (this.icon) {
        addClassnames(this, 'has-icon');

        if (!this.icon.size) {
          this.dynamicIconSize = true;
          this.sizeIcon(this.icon);
        }

        assignSlotNames([this.icon, 'icon']);
      }
    });

    if (!isNil(this.value)) {
      this.visualizedValue = this.value;
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (this.icon && this.dynamicIconSize && (changedProperties.has('size') || changedProperties.has('line'))) {
      this.sizeIcon(this.icon);
    }
  }

  /* TODO:

    ! TEST IE
      - IE does not like icons inside of the progress circle
        ? do we drop that feature for IE?!
          ^ the big question at this point is dropping it for IE vs. dropping it altogether
      X chaos test in IE!
        ! smooth animation doesn't work in IE; it just jumps
        ? do we care?

    ! WRITE UNIT TESTS

    X SIZING
      X do we need to preserve any custom sizing? (i say 'yeah'...)
        ! TODO: VISUALLY VERIFY THIS
      - split out sizing code into its own utility
      ! FIXME: dynamic padding around isn't happy...

    ? ANIMATION? <= REFERENCES THE JS-BASED TWEENING
      - split out animation code into its own utility
      - can we handle the 0 <-> 100 value issue somewhere else?
  */

  render() {
    const circumference = 2 * Math.PI * this.radius;
    const progressOffset = ((100 - (this.value || 30)) / 100) * circumference;

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
            <path
              d="M 18 18 m 0,-${this.radius} a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius} a ${this
                .radius},${this.radius} 0 1 1 0,-${2 * this.radius}"
              class="arcstroke"
              stroke-width="${this.line}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${progressOffset}"
              fill="none"
            />
          </svg>
        </div>
      </div>
    `;
  }

  oldRender() {
    return html`
      <div class="private-host" aria-hidden="true">
        ${this.icon ? html`<div class="icon-wrapper"><slot name="icon"></slot></div>` : ''}
        <div class="progress-wrapper" style="display:none">
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
      <div class="private-host">
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
            <path
              d="M 18 18 m 0,-${this.radius} a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius} a ${this
                .radius},${this.radius} 0 1 1 0,-${2 * this.radius}"
              class="arcstroke"
              stroke-width="${this.line}"
              fill="none"
            />
          </svg>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
