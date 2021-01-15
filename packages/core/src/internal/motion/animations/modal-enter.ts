/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TargetedAnimation } from '../interfaces.js';

export const AnimationModalEnterName = 'modal-enter';
export const AnimationModalEnterConfig: TargetedAnimation[] = [
  {
    target: '.overlay-backdrop',
    onlyIf: 'isLayered:false',
    animation: [{ opacity: 0 }, { opacity: 1 }],
    options: {
      duration: '--animation-duration',
      easing: '--animation-easing',
      fill: 'forwards',
    },
  },
  {
    target: '.private-host',
    animation: [
      { opacity: 0, transform: 'translateY(-15rem)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    options: {
      duration: '--animation-duration',
      easing: '--animation-easing',
      fill: 'forwards',
      endDelay: 50,
    },
  },
];
