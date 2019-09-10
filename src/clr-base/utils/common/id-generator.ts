/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hasClarityBase } from './namespace';

const ID_NAME = 'idCounter';

export const namespaceIdExists = hasClarityBase(ID_NAME);

export const generateId = (cbNS: any): number => {
  switch (namespaceIdExists(cbNS)) {
    case true:
      cbNS[ID_NAME] = cbNS[ID_NAME]++;
      break;
    case false:
      cbNS[ID_NAME] = 0;
      break;
    default:
      break;
  }
  return cbNS[ID_NAME];
};

// TODO: i'm thinking this field should be a getter/setter -> largely so that we can guard against people setting it to a lower value or setting it to something other than a number
