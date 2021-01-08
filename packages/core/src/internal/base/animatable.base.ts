/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LitElement } from 'lit-element';
import { CdsBaseFocusTrap } from './focus-trap.base.js';
import { property } from '../decorators/property.js';

export const enum EnterAnimationSteps {
  EnterStart = 'enter-start',
  EnterActive = 'enter-active',
  EnterEnd = 'enter-end',
}

export const enum ExitAnimationSteps {
  ExitStart = 'exit-start',
  ExitActive = 'exit-active',
  ExitEnd = 'exit-end',
}

interface Animatable {
  motion: string;
  motionReady: boolean;
  motionScript: string[];
  motionActiveSteps: string[];
  motionTiming: string;
  motionTrigger: string;
  motionRun(): void;
  updated(props: Map<string, any>): void;
}

const DefaultAnimationScript = [
  EnterAnimationSteps.EnterStart,
  EnterAnimationSteps.EnterActive,
  EnterAnimationSteps.EnterEnd,
  ExitAnimationSteps.ExitStart,
  ExitAnimationSteps.ExitActive,
  ExitAnimationSteps.ExitEnd,
];

const DefaultAnimationActiveSteps = [EnterAnimationSteps.EnterActive, ExitAnimationSteps.ExitActive];

// TODO: SHARED FUNCTIONS GO HERE...

function runAnimation(animatable: CdsAnimatable | CdsAnimatableFocusTrap) {
  if (props.has('hidden') && this.cdsMotion !== 'off') {
    if (!animatable.motionReady) {
      this.initted = true; // avoid firstpass run through
    } else {
      this.runAnimation(this.hidden ? 'hide' : 'show');
    }
  }
}

function checkPropsForMotionTrigger(trigger: string, props: Map<string, any>) {
  return props.has(trigger);
}

export class CdsAnimatable extends LitElement implements Animatable {
  motionReady = false;

  @property({ type: String })
  motionTrigger = 'hidden';

  motionScript = DefaultAnimationScript;

  motionActiveSteps = DefaultAnimationActiveSteps;

  @property({ type: String })
  motion = 'off';

  @property({ type: String })
  motionTiming: string;

  firstUpdated(props: Map<string, any>) {
    // TODO: check here to see if animation needs to start at the enter-end or on state
    super.firstUpdated(props);
  }

  updated(props: Map<string, any>) {
    // TODO: need more functional way to kick off the animations
    runAnimation(this);
    super.updated(props);
  }

  motionRun() {
    return;
  }
}

export class CdsAnimatableFocusTrap extends CdsBaseFocusTrap implements Animatable {
  motionReady = false;

  motionScript = DefaultAnimationScript;

  motionActiveSteps = DefaultAnimationActiveSteps;

  @property({ type: String })
  motionTrigger = 'hidden';

  @property({ type: String })
  motion = 'off';

  @property({ type: String })
  motionTiming: string;

  updated(props: Map<string, any>) {
    super.updated(props);
  }

  motionRun() {
    return;
  }
}
