/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export type AnimationStep = {
  value: string;
  duration?: string;
};

export interface Animatable {
  motion: string;
  motionReady: boolean;
  motionScript: AnimationStep[];
  motionTrigger: string;
  updated(props: Map<string, any>): void;
}

export const enum AnimationStepValues {
  Start = 'start',
  Active = 'active',
  End = 'end',
  Enabled = 'on',
  Disabled = 'off',
}

export const DefaultAnimationScript: AnimationStep[] = [
  { value: AnimationStepValues.Start },
  {
    value: AnimationStepValues.Active,
    duration: '--cds-global-animation-duration-4',
    easing: '--cds-global-animation-easing-0',
  },
  { value: AnimationStepValues.End },
];
