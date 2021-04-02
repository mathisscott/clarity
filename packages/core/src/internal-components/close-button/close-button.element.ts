/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { html } from 'lit';
import { CdsBaseButton, baseStyles, isBrowser, property, setAttributes, HTMLAttributeTuple, queryChildFromLightOrShadowDom } from '@cds/core/internal';
import { ClarityIcons } from '@cds/core/icon/icon.service.js';
import { timesIcon } from '@cds/core/icon/shapes/times.js';
import styles from './close-button.element.scss';

export const CdsCloseButtonTagName = 'cds-internal-close-button';

// TODO: TESTME
export function createCloseButton(
  hostElement: HTMLElement,
  attributes?: HTMLAttributeTuple[],
  clickHandler?: () => void
) {
  if (isBrowser() && !!hostElement) {
    const closeBtn = document.createElement(CdsCloseButtonTagName);

    if (attributes && attributes.length > 0) {
      setAttributes(closeBtn, ...attributes);
    }

    if (clickHandler) {
      closeBtn.addEventListener('click', clickHandler.bind(hostElement));
    }

    return closeBtn;
  } else {
    return false;
  }
}

// TODO: TESTME
export function prependCloseButton(
  hostElement: HTMLElement,
  attributes?: HTMLAttributeTuple[],
  clickHandler?: () => void
) {
  const closeButton = createCloseButton(hostElement, attributes, clickHandler);

  if (closeButton === false) {
    return;
  } else {
    hostElement.insertBefore(closeButton, hostElement.children[0]);
  }
}

export function appendCloseButton(
  hostElement: HTMLElement,
  attributes?: HTMLAttributeTuple[],
  clickHandler?: () => void
) {
  const closeButton = createCloseButton(hostElement, attributes, clickHandler);

  if (closeButton === false) {
    return;
  } else {
    hostElement.appendChild(closeButton);
  }
}

export function removeCloseButton(hostElement: HTMLElement) {
  if (isBrowser() && !!hostElement) {
    const closeBtn = queryChildFromLightOrShadowDom(hostElement, CdsCloseButtonTagName);

    if (closeBtn) {
      hostElement.removeChild(closeBtn);
    }
  }
}

/**
 * Standard close button for Clarity Components
 *
 * ```typescript
 * import '@cds/core/internal-components/close-button/register.js';
 * ```
 *
 * ```html
 * <cds-internal-close-button></cds-internal-close-button>
 * ```
 *
 * @element cds-internal-close-button
 * @cssprop --background
 * @cssprop --color
 * @cssprop --opacity
 * @cssprop --padding
 */
export class CdsInternalCloseButton extends CdsBaseButton {
  @property({ type: String })
  iconSize = '18';

  @property({ type: String })
  iconShape = 'times';

  render() {
    return html`
      <div class="private-host">
        <cds-icon shape="${this.iconShape}" size="${this.iconSize}"></cds-icon>
      </div>
    `;
  }

  static get styles() {
    return [baseStyles, styles];
  }

  constructor() {
    super();
    ClarityIcons.addIcons(timesIcon);
  }
}
