/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdsBaseFocusTrap } from './focus-trap.base.js';
import { property } from '../decorators/property.js';
import { event, EventEmitter } from '../decorators/event.js';
import { Animatable, AnimationStep, DefaultAnimationScript } from '../animatable/interfaces.js';
import { getMotionContainer, checkPropsAndRunAnimation } from '../animatable/utils.js';

// import { sleep } from '../utils/async.js';

// NOTE: when/if we need a non-focus-trapped animated component,
// we will need to copy the internals of the CdsAnimatableFocusTrap in here
// export class CdsAnimatable extends LitElement implements Animatable {
// }

export class CdsAnimatableFocusTrap extends CdsBaseFocusTrap implements Animatable {
  // TODO: IS THIS STILL NEEDED?
  motionReady = false;

  motionScript: AnimationStep[] = DefaultAnimationScript;

  motionContainerSelector: string;

  get motionContainer() {
    return getMotionContainer(this.motionContainerSelector, this);
  }

  // TODO: TESTME
  @event() protected motionChange: EventEmitter<boolean>;

  // TODO: EXAMPLE USAGE OF EVENT DECORATOR. REMOVE
  // private toggle() {
  //   this.motionChange.emit(this.motion);
  // }

  // TODO: TESTME
  @property({ type: String })
  motionTrigger = 'hidden';

  // TODO: TESTME
  @property({ type: String })
  motion = 'off';
  // TODO: need an example of this! => 'end' MutationObserver watches for this value!

  // TODO: TESTME? i don't think this is necessary. should be able to check for animation timing via CSS
  @property({ type: String })
  motionTiming: string;

  updated(props: Map<string, any>) {
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
