/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdsBaseFocusTrap } from './focus-trap.base.js';
import { property } from '../decorators/property.js';
// import { sleep } from '../utils/async.js';

// ===============================================

/*
  THOUGHTS
  - we may be able to overload the "trigger" attribute or remove it altogether
    - if we apply the [hidden][cds-motion="start"] selectors we may be able to move
      a lot of this internal logic into the CSS
      - this may not be as "ergonomic" for vanilla JS/TS devs but webdevs would probably
        like it a lot more
    - changes AnimationSteps to 'on', 'off', 'start', 'active', 'end'
    - presence or absence of "trigger" attribute determines which animation happens...
  ? what about active animation steps?? how do we determine those?
    ! what's happening now?!
*/

export const enum AnimationSteps {
  Start = 'start',
  Active = 'active',
  End = 'end',
}

interface Animatable {
  motion: string;
  motionReady: boolean;
  motionScript: string[];
  motionTiming: string;
  motionTrigger: string;
  motionRun(): void;
  updated(props: Map<string, any>): void;
}

const DefaultAnimationScript = [AnimationSteps.Start, AnimationSteps.Active, AnimationSteps.End];

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

  @property({ type: String })
  motionTrigger = 'hidden';

  motionScript = DefaultAnimationScript;

  @property({ type: String })
  motion = 'off';
  // TODO: need an example of this! => 'end' MutationObserver watches for this value!

  @property({ type: String })
  motionTiming: string;

  firstUpdated(props: Map<string, any>) {
    // TODO: check here to see if animation needs to start at the enter-end or on state
    super.firstUpdated(props);
  }

  updated(props: Map<string, any>) {
    // TODO: need more functional way to kick off the animations
    // runAnimation(this);
    super.updated(props);
  }

  motionRun() {
    /*
    const animationPlan = showOrHide === 'show' ? animationPlans.get('enter') : animationPlans.get('leave');
    // TODO: MOVE COMPUTED STYLE INTO A UTILITY
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
