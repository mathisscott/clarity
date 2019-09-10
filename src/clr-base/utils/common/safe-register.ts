/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { throwConsoleWarning } from './exceptions';
import { curry, __ } from 'ramda';

const curriedElementExists = curry(function(registry: any, tagName: string) {
  return !!registry.get(tagName);
});

const elementExists = curriedElementExists(window.customElements);

const curriedRegisterElementSafely = curry(function(
  tagName: string,
  elementClass: any,
  registry = window.customElements
) {
  if (elementExists(tagName)) {
    throwConsoleWarning(`${tagName} has already been registered`);
  } else {
    registry.define(tagName, elementClass);
  }
});

export const registerElementSafely = curriedRegisterElementSafely(__, __, window.customElements);
