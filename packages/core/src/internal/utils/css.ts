/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LogService } from '../services/log.service.js';

export function hasClassnames(el: HTMLElement, ...classNames: string[]) {
  return classNames.filter((cn: string) => el.classList.contains(cn)).length === classNames.length;
}

export function addClassnames(el: HTMLElement, ...classNames: string[]): HTMLElement {
  classNames.forEach((cn: string) => {
    el.classList.add(cn);
  });
  return el;
}

export function removeClassnames(el: HTMLElement, ...classNames: string[]): HTMLElement {
  classNames.forEach((cn: string) => {
    el.classList.remove(cn);
  });
  return el;
}

export function removeClassnamesUnless(
  el: HTMLElement,
  classnamesToRemove: string[],
  classnamesToKeep: string[]
): HTMLElement {
  const filteredClassnamesToRemove = classnamesToRemove.filter(cn => classnamesToKeep.indexOf(cn) < 0);
  return removeClassnames(el, ...filteredClassnamesToRemove);
}

export function updateElementStyles(el: HTMLElement, ...styleTuples: [string, string][]): HTMLElement {
  styleTuples.forEach(([styleKey, value]) => {
    (el.style as { [key: string]: any })[styleKey] = value;
  });
  return el;
}

export function pxToRem(pxValue: number) {
  const baseProp = getCssPropertyValue('--cds-global-typography-base-font-size');
  const baseFontSize = (16 * parseInt(baseProp !== '' ? baseProp : '100%')) / 100;
  return `${pxValue / baseFontSize}rem`;
}

// TODO: TESTME

export function getCssPropertyValue(
  propertyName: string,
  el: Element = document.body,
  pseudoSelectorModifier: string | null = null
) {
  try {
    return getComputedStyle(el, pseudoSelectorModifier).getPropertyValue(propertyName).trim();
  } catch (e) {
    LogService.warn('Container element passed to getCustomPropertyValue must be an element.');
    return '';
  }
}

// TODO: TESTME

export function isCssPropertyName(str: string): boolean {
  return str.slice(0, 2) === '--';
}
