/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export function arrayToObject(arr: any[], key: string) {
  return arr.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
}

export function arrayTail(arr: any[]) {
  return arr.length ? arr[arr.length - 1] : void 0;
}

// TODO: TESTME
export function indexOfObjectFromValue(objArray: object[], prop: string, value: boolean | string | number) {
  let index = -1;
  objArray.forEach((obj, idx) => {
    if (index > -1) {
      return;
    } else if (obj.hasOwnProperty(prop) && (obj as any)[prop] === value) {
      index = idx;
    }
  });
  return index;
}
