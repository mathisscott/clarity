/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  applyMixins,
  baseStyles,
  CssHelpers,
  hasStringPropertyChanged,
  property,
  querySlot,
  StatusTypes,
  updateEquilateralSizeStyles,
} from '@clr/core/internal';
import { html, LitElement } from 'lit-element';
import { styles } from './progress-circle.element.css.js';

// START --> MOVE TO HELPER FILE

interface XyPoints {
  x: number;
  y: number;
}

// TESTME
export function pctCompleteToRadians(pctComplete?: number): number {
  return 360 * ((pctComplete || 30) / 100);
}

// TESTME
export function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  // IN => centerX centerY radius angle
  // LEFTOFF: WHY ARE START AND END FLIPPED?!
  const start = getCartesianPointsForCircularProgress(endAngle, x, y);
  const end = getCartesianPointsForCircularProgress(startAngle, x, y);
  // OUT => point.x point.y

  // IN => startAngle endAngle
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  // OUT => 0 or 1

  // IN => start, end, radius, largeArcFlag
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

// TESTME
export function getCartesianPointsForCircularProgress(
  angleInDegrees: number,
  radius: number,
  centerPointX = 18,
  centerPointY = 18
): XyPoints {
  // viewbox for circular progress is 36. center is therefore 18. radius of 16 keeps bar off edge of
  // viewbox to avoid being cutoff
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerPointX + radius * Math.cos(angleInRadians),
    y: centerPointY + radius * Math.sin(angleInRadians),
  };

  // LEFTOFF: !!! radius needs to be a function of the line-thickness!
}

// END --> MOVE TO HELPER FILE

class ProgressCircleMixinClass extends LitElement {}

applyMixins(ProgressCircleMixinClass, [CssHelpers]);

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
export class CdsProgressCircle extends ProgressCircleMixinClass {
  private center: number;

  private radius: number;

  private _size: string;

  @querySlot('cds-icon') protected icon: HTMLElement;

  /**
   * @type {default | info | success | warning | danger | inverse}
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

  /**
   * Numerical width and height. We cannot use t-shirt sizes because we
   * cannot predict overrides to our token system. Numbers are more specific
   * and simplify the complexity of the internals of the circular progress
   * when calculating radians.
   *
   * TODO: CAN WE CALCULATE DYNAMICALLY?
   */
  // @property({ type: Number })
  // size = 36;

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

  constructor() {
    super();
    // this.center = this.size / 2;
    // this.radius = this.center - Math.ceil(this.line / 2);
  }

  get path(): string {
    return describeArc(18, 18, 16, 0, pctCompleteToRadians(this.value));
  }

  /*
    NOTES
    - seems to be okay with rem sizing and filling its container!
      ! hardcode to 36/36 like with icons
        ! this means hardcoding center and everything else
      - we can also use icon-style sizing
    - need slot for icons
    - needs cushion around the edge, especially at smaller size
    - need animation for spinner
    ! deprecate cds-icon size classnames!

  */

  render() {
    return html`
      <div class="private-host" aria-hidden="true">
        <svg
          version="1.1"
          viewBox="0 0 ${this.size} ${this.size}"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          focusable="false"
        >
          <circle
            stroke-width="${this.line}"
            fill="none"
            cx="${this.center}"
            cy="${this.center}"
            r="${this.radius}"
            class="${this.value > 99 ? 'arcstroke' : 'backstroke'}"
          />
          <path d="${this.path}" class="arcstroke" stroke-width="${this.line}" fill="none" />
        </svg>
      </div>
    `;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}

export interface CdsProgressCircle extends ProgressCircleMixinClass, CssHelpers {}
