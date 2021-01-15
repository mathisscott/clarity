/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TargetedAnimation } from '../interfaces.js';

export const AnimationShakeName = 'shake';
export const AnimationShakeConfig: TargetedAnimation[] = [
  {
    target: '.private-host',
    animation: [
      { transform: 'translate3d(0, 0, 0)' },
      { transform: 'translate3d(-10px, 0, 0)', offset: 0.1 },
      { transform: 'translate3d(10px, 0, 0)', offset: 0.2 },
      { transform: 'translate3d(-10px, 0, 0)', offset: 0.3 },
      { transform: 'translate3d(10px, 0, 0)', offset: 0.4 },
      { transform: 'translate3d(-10px, 0, 0)', offset: 0.5 },
      { transform: 'translate3d(10px, 0, 0)', offset: 0.6 },
      { transform: 'translate3d(-10px, 0, 0)', offset: 0.7 },
      { transform: 'translate3d(10px, 0, 0)', offset: 0.8 },
      { transform: 'translate3d(-10px, 0, 0)', offset: 0.9 },
      { transform: 'translate3d(0, 0, 0)' },
    ],
    options: {
      duration: 1200,
      easing: 'ease-in-out',
      endDelay: 50,
    },
  },
];
