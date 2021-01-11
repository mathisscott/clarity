/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export type AnimationStep = {
  step: string;
  isActive: boolean;
};

export interface Animatable {
  motion: string;
  motionReady: boolean;
  motionScript: AnimationStep[];
  motionTiming: string;
  motionTrigger: string;
  motionRun(): void;
  updated(props: Map<string, any>): void;
}

export const enum AnimationStepLabels {
  Start = 'start',
  Active = 'active',
  End = 'end',
}

export const DefaultAnimationScript: AnimationStep[] = [
  { step: AnimationStepLabels.Start, isActive: false },
  { step: AnimationStepLabels.Active, isActive: true },
  { step: AnimationStepLabels.End, isActive: false },
];
