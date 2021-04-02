/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { property } from '@cds/core/internal';
import { html, LitElement, svg, TemplateResult } from 'lit';
import styles from './pointer.element.scss';

// TODO: TESTME
export function getPointer(type: string): TemplateResult<2> {
  if (type === 'angle') {
    return svg`<svg part="pointer-img" class="pointer-img" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path part="pointer-fill" class="pointer-fill" d="M0 12, 0 0, 12 12Z"></path>
        <path part="pointer-border" class="pointer-border" d="M0 12, 0 0, 12 12, 10 12, 1.4 3, 1.4 12Z"></path>
      </svg>`;
  } else {
    return svg`<svg part="pointer-img" class="pointer-img compact" viewBox="0 0 12 6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path part="pointer-fill" class="pointer-fill" d="M0 6, 6 0, 12 6Z"></path>
        <path part="pointer-border" class="pointer-border" d="M0 6, 6 0, 12 6, 10.6 6, 6 1.4, 1.4 6Z"></path>
      </svg>`;
  }
}

/**
 * ```typescript
 * import '@cds/core/internal-components/popup/register.js';
 * ```
 *
 * ```html
 * <cds-internal-pointer></cds-internal-pointer>
 * ```
 *
 * @beta
 * @element cds-internal-pointer
 * @slot - Content slot to override the default pointer SVG
 * @cssprop --pointer-fill
 * @cssprop --pointer-outline
 * // TODO: UPDATE CSS PROPS
 *
 */

// TODO: need to have the datagrid mountain peak as an alt pointer
// default pointer template versus alt pointer template => angle vs. ???
export class CdsInternalPointer extends LitElement {
  @property({ type: String })
  axisAlign: 'start' | 'center' | 'end' = 'start';

  @property({ type: String })
  type: 'angle' | 'default' = 'default';

  protected get pointerTemplate() {
    return getPointer(this.type);
  }

  protected render() {
    return html`<slot>${this.pointerTemplate}</slot>`;
  }

  static get styles() {
    return [styles];
  }
}
