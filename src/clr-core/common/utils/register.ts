/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import and from 'ramda/es/and';
import curryN from 'ramda/es/curryN';
import isNil from 'ramda/es/isNil';
import { elementExists, existsInWindow } from './exists';

const addElementToRegistry = curryN(
  3,
  (tagName: string, elementClass: any, registry: { define: (a: string, b: any) => {} }) => {
    if (elementExists(tagName)) {
      console.warn(`${tagName} has already been registered`);
    } else {
      registry.define(tagName, elementClass);
    }
  }
);

export function registerElementSafely(tagName: string, elementClass: any) {
  const guard = and(!isNil(window), existsInWindow(['customElements']));

  if (!guard) {
    // early return if window or window.customElements is null or undefined
    return;
  }

  addElementToRegistry(tagName, elementClass, window.customElements);
}
