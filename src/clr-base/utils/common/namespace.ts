/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { has } from 'ramda';

const CLARITY_BASE_NAMESPACE = 'ClarityBase';

export const hasClarityBase = has(CLARITY_BASE_NAMESPACE);

export const getClarityBaseNamespace = (win: any): any => {
  if (!win) {
    return;
  }
  if (!hasClarityBase(win)) {
    win.ClarityBase = {};
  }
  return win.ClarityBase;
};
