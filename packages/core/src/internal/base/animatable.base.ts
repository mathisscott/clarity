/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdsBaseFocusTrap } from './focus-trap.base.js';
import { property } from '../decorators/property.js';
import { event, EventEmitter } from '../decorators/event.js';
// import { sleep } from '../utils/async.js';

export const enum AnimationStepLabels {
  Start = 'start',
  Active = 'active',
  End = 'end',
}

type AnimationStep = {
  step: string;
  isActive: boolean;
};

interface Animatable {
  motion: string;
  motionReady: boolean;
  motionScript: AnimationStep[];
  motionTiming: string;
  motionTrigger: string;
  motionRun(): void;
  updated(props: Map<string, any>): void;
}

const DefaultAnimationScript: AnimationStep[] = [
  { step: AnimationStepLabels.Start, isActive: false },
  { step: AnimationStepLabels.Active, isActive: true },
  { step: AnimationStepLabels.End, isActive: false },
];

// TODO: SHARED FUNCTIONS GO HERE...

// async function runAnimation(animatable: CdsAnimatableFocusTrap) {
//   if (props.has('hidden') && this.cdsMotion !== 'off') {
//     if (!animatable.motionReady) {
//       this.initted = true; // avoid firstpass run through
//     } else {
//       await sleep(100);
//       this.runAnimation(this.hidden ? 'hide' : 'show');
//     }
//   }
// }

function checkPropsForMotionTrigger(trigger: string, props: Map<string, any>) {
  return props.has(trigger);
}

function checkPropsAndRunAnimation(trigger: string, props: Map<string, any>, runFn: () => void) {
  if (checkPropsForMotionTrigger(trigger, props)) {
    runFn();
  }
}

// TODO: TESTME
export function nextAnimationStep(currentAnimationStep: string) {
  switch (currentAnimationStep) {
    case 'off':
      return 'off';
    case 'on':
      return 'start';
    case 'start':
      return 'active';
    case 'active':
      return 'end';
    case 'end':
      return 'on';
  }
}

// NOTE: when/if we need a non-focus-trapped animated component,
// we will need to copy the internals of the CdsAnimatableFocusTrap in here
// export class CdsAnimatable extends LitElement implements Animatable {
// }

export class CdsAnimatableFocusTrap extends CdsBaseFocusTrap implements Animatable {
  motionReady = false;

  motionScript = DefaultAnimationScript;

  motionContainerSelector: string;

  // TODO: TESTME and make it funcy!
  get motionContainer() {
    if (!this.motionContainerSelector) {
      return this;
    } else {
      const sel = this.motionContainerSelector;
      const shadowDomContainer = this.shadowRoot.querySelector<HTMLElement>(sel);
      const lightDomContainer = this.querySelector<HTMLElement>(sel);
      return shadowDomContainer || lightDomContainer || this;
    }
  }

  // TODO: TESTME
  @event() protected motionChange: EventEmitter<boolean>;

  // TODO: EXAMPLE USAGE OF EVENT DECORATOR. REMOVE
  // private toggle() {
  //   this.motionChange.emit(this.motion);
  // }

  @property({ type: String })
  motionTrigger = 'hidden';

  @property({ type: String })
  motion = 'off';
  // TODO: need an example of this! => 'end' MutationObserver watches for this value!

  @property({ type: String })
  motionTiming: string;

  updated(props: Map<string, any>) {
    // TODO: need more functional way to kick off the animations
    // runAnimation(this);
    checkPropsAndRunAnimation(this.motionTrigger, props, this.motionRun);
    super.updated(props);
  }

  motionRun() {
    /*
    const animationPlan = showOrHide === 'show' ? animationPlans.get('enter') : animationPlans.get('leave');
    // TODO: MOVE COMPUTED STYLE INTO A UTILITY
    !! getCssPropertyValue
    const activeAnimationDuration = getComputedStyle(this).getPropertyValue('--animation-duration') || '0.3s';

    animationPlan?.forEach(async (step, index) => {
      if (index === 0) {
        console.log('0 ', step);
        this.cdsMotion = step;
      } else {
        console.log(`${index} ${step}: ${getMillisecondsFromSecondsStyleValue(activeAnimationDuration) + 10}`);
        if (showOrHide === 'show') {
          await sleep(getMillisecondsFromSecondsStyleValue(activeAnimationDuration) + 10); // pad just a little
          this.cdsMotion = step;
        } else {
          await sleep(getMillisecondsFromSecondsStyleValue(activeAnimationDuration) + 10); // pad just a little
          this.cdsMotion = step;
          await sleep(getMillisecondsFromSecondsStyleValue(activeAnimationDuration) * 2 + 10); // pad just a little
        }
      }
    });
*/
    return;
  }
}
