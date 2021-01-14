/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export type AnimationStep = {
  value: string | (() => string); // TODO: may not need string fn()
  duration?: string;
};

export interface Animatable {
  cdsMotion: string;
  cdsMotionType: string;
  cdsMotionTypes: string;
  motionReady: boolean;
  motionSequence: AnimationStep[];
  motionTrigger: string;
  updated(props: Map<string, any>): Promise<void>;
}

export const enum AnimationStepValues {
  Start = 'start',
  Active = 'active',
  End = 'end',
  Enabled = 'on',
  Disabled = 'off',
  Awaiting = 'ready',
}

export const DefaultAnimationSequence: AnimationStep[] = [
  { value: AnimationStepValues.Start },
  {
    value: AnimationStepValues.Active,
    duration: '--cds-global-animation-duration-4',
  },
  { value: AnimationStepValues.End },
];
