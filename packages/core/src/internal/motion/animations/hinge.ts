/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TargetedAnimation } from '../interfaces.js';

export const AnimationHingeName = 'hinge-exit';
export const AnimationHingeConfig: TargetedAnimation[] = [
  {
    target: '.overlay-backdrop',
    onlyIf: 'isLayered:false',
    animation: [{ opacity: 1, offset: 0.8 }, { opacity: 0 }],
    options: {
      duration: '--animation-duration',
      easing: '--animation-easing',
      fill: 'forwards',
    },
  },
  {
    target: '.private-host',
    animation: [
      { transform: 'rotate3d(0, 0, 1, 80deg)', offset: 0.2 },
      { transform: 'rotate3d(0, 0, 1, 60deg)', offset: 0.4 },
      { transform: 'rotate3d(0, 0, 1, 80deg)', offset: 0.6 },
      { transform: 'rotate3d(0, 0, 1, 60deg)', opacity: 1, offset: 0.8 },
      { opacity: 0, transform: 'translate3d(0, 700px, 0)' },
    ],
    options: {
      duration: 1200,
      easing: 'ease-in-out',
      fill: 'forwards',
      endDelay: 50,
    },
  },
];
