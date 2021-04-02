/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  baseStyles,
  getElementUpdates,
  HTMLAttributeTuple,
  i18n,
  I18nService,
  property,
  querySlot,
  setAttributes,
  updateElementStyles,
} from '@cds/core/internal';
import { prependCloseButton } from '@cds/core/internal-components/close-button';
import { html } from 'lit';
import { query } from 'lit/decorators/query.js';
import { CdsInternalOverlay } from '@cds/core/internal-components/overlay';

import sharedStyles from '../overlay/shared.element.scss';
import styles from './popup.element.scss';
import { getPopupPosition } from './utils/index.js';
import { CdsInternalPointer } from './pointer.element.js';
import { AxisAligns, PositionObj } from './interfaces.js';

/**
 * ```typescript
 * import '@cds/core/internal-components/popup/register.js';
 * ```
 *
 * ```html
 * <cds-internal-popup>
 *  <section cds-layout="vertical align:horizontal-stretch">
 *    <div cds-layout="vertical pad:md gap:md">
 *      <h2 cds-text="display">A Title</h2>
 *      <div>
 *        <p cds-text="body">
 *          Content inside a generic popup.
 *        </p>
 *      </div>
 *    </div>
 *  </section>
 * </cds-internal-popup>
 * ```
 *
 * @beta
 * @element cds-internal-popup
 * @slot - Content slot for the content inside the popup's panel
 * @event closeChange - Notify user when close event has occurred
 * @cssprop --background
 * @cssprop --backdrop-background
 * @cssprop --layered-backdrop-background
 * @cssprop --border-color
 * @cssprop --border-radius
 * @cssprop --border-width
 * @cssprop --box-shadow
 * @cssprop --color
 * @cssprop --min-height
 * @cssprop --min-width
 * @cssprop --max-height
 * @cssprop --max-width
 * @cssprop --overflow - sets overflow x and y values respectively
 * @cssprop --height
 * @cssprop --width
 * @cssprop --animation-duration
 * @cssprop --animation-easing
 * // TODO: UPDATE CSSPROPS
 *
 * KNOWN ISSUE: Safari jumps through the exit animation but only when the ESC key is pressed.
 *
 */
export class CdsInternalPopup extends CdsInternalOverlay {
  @property({ type: Object })
  anchor: Element;

  @property({ type: String })
  cdsMotion = 'off';

  // TODO: NEED TO WIRE UP AXIS OFFSETS!
  @property({ type: Number })
  mainAxisOffset = 2;

  @property({ type: Number })
  crossAxisOffset = 0;

  @property({ type: String })
  orientation: string;

  @i18n() i18n = I18nService.keys.modal;

  /**
   * If false, the dropdown will not show a close button ever.
   * If true, it will always show a close button.
   * If undefined, it will only show a close button when responsive. a11y expects a close button when responsive.
   *
   */
  @property({ type: Boolean })
  closable: boolean;

  addCloseButton() {
    const closeButtonAttrs: HTMLAttributeTuple[] = [
      ['cds-layout', 'align:top'],
      ['slot', 'close-button'],
      ['aria-label', this.i18n.closeButtonAriaLabel],
      ['icon-size', '24'],
    ];
    prependCloseButton(this.contentWrapper, closeButtonAttrs, () => this.closeOverlay('close-button-click'));
  }

  @property({ type: String })
  pointerAlign: AxisAligns = 'start';

  @property({ type: String })
  anchorAlign: AxisAligns = 'start';

  @query('.pointer-wrapper') pointerWrapper: HTMLElement;

  @querySlot('cds-internal-pointer', { assign: 'pointer' }) pointer: CdsInternalPointer;

  @query('.private-host') contentWrapper: HTMLElement;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observers.forEach(o => o.disconnect());
  }

  firstUpdated(props: Map<string, any>) {
    super.firstUpdated(props);
    this.setUpPositioningObserver();
    this.addCloseButton();
  }

  updated(props: Map<string, any>) {
    if (this.pointer && !this.pointer.hasAttribute('part')) {
      setAttributes(this.pointer, ['part', 'pointer']);
    }
    super.updated(props);
  }

  private get anchorRect(): DOMRect {
    return this.anchor?.getBoundingClientRect() || new DOMRect();
  }

  protected observers: (MutationObserver | ResizeObserver)[] = [];

  private setUpPositioningObserver() {
    this.observers.push(
      getElementUpdates(this, 'hidden', () => {
        if (this.hidden === false) {
          // have to pre-emptively remove stealth attr so that measurements won't take responsive width/height
          // as the popup's actual width/height
          this.removeAttribute('_responsive');

          const myPosition = getPopupPosition(
            this.orientation,
            this.anchorRect,
            this.anchorAlign,
            this.pointer,
            this.pointerAlign,
            this.contentWrapper,
            this.mainAxisOffset,
            this.crossAxisOffset
          );

          if (myPosition === (false as unknown)) {
            // have to manually set this here because the CSS needs it and the work happens
            // outside of the update loop
            setAttributes(this, ['_responsive', ''], ['_position-at', false]);
            updateElementStyles(this.contentWrapper, ['position', ''], ['top', ''], ['left', '']);
            updateElementStyles(this.pointerWrapper, ['visibility', 'hidden']);
          } else {
            if (this.pointer) {
              // TODO: will need to adjust pointer ROTATION based on position
              // TODO: we will need an active corner/cross-axis internalProp so people can style the pointer based on location
              updateElementStyles(
                this.pointerWrapper,
                ['visibility', 'visible'],
                ['position', 'absolute'],
                ['top', ((myPosition as unknown) as PositionObj).pointer.top + 'px'],
                ['left', ((myPosition as unknown) as PositionObj).pointer.left + 'px']
              );

              setAttributes(this, ['_position-at', ((myPosition as unknown) as PositionObj).pointerLocation as string]);
            } else {
              setAttributes(this, ['_position-at', false]);
            }

            updateElementStyles(
              this.contentWrapper,
              ['position', 'absolute'],
              ['top', ((myPosition as unknown) as PositionObj).popup.top + 'px'],
              ['left', ((myPosition as unknown) as PositionObj).popup.left + 'px']
            );
          }
        }
      })
    );
  }

  // TODO: content wrappers will need a _positioned attr that will allow us to zero out border radius
  //       if we need to

  // TODO: Double check if tabindex here needs to be zero instead!
  // keep same render body fn and provide protected props on popup that are blank
  // that are rendered inside the render method
  protected render() {
    return html`
      ${this.backdropTemplate}
      <div class="private-host" tabindex="-1" aria-modal="true" role="dialog" part="host-wrapper">
        <slot></slot>
      </div>
      <div class="pointer-wrapper"><slot name="pointer"></slot></div>
    `;
  }

  static get styles() {
    return [baseStyles, styles, sharedStyles];
  }
}
