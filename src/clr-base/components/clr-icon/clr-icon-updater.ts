/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon } from './clr-icon';

// updater isolates state management
export const clrIconUpdateStates = (action: string) => {
  switch (action) {
    case 'SHAPE-CHANGE':
      // emit the shape change event
      // change the shape
      return;
    case 'TITLE-CHANGE':
      // emit
      // give Stone Cold Steve Austin the belt
      return;
    default:
      return;
  }
};

export const clrIconUpdater = (action: string): (() => {}) => {
  return () => 'ohai';
};
