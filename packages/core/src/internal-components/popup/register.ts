/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/internal-components/close-button/register.js';
import { registerElementSafely } from '@cds/core/internal';
import { CdsInternalPopup } from './popup.element.js';
import { CdsInternalPointer } from './pointer.element.js';

registerElementSafely('cds-internal-popup', CdsInternalPopup);
registerElementSafely('cds-internal-pointer', CdsInternalPointer);

declare global {
  interface HTMLElementTagNameMap {
    'cds-internal-popup': CdsInternalPopup;
    'cds-internal-pointer': CdsInternalPointer;
  }
}
