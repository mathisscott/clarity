/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { indexOfObjectFromValue } from '../utils/array.js';
import { queryElementFromShadowOrLightDom } from '../utils/dom.js';
import { DefaultAnimationScript } from './interfaces.js';

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

export function checkPropsForMotionTrigger(trigger: string, props: Map<string, any>) {
  return props.has(trigger);
}

export function checkPropsAndRunAnimation(trigger: string, props: Map<string, any>, runFn: () => void) {
  if (checkPropsForMotionTrigger(trigger, props)) {
    runFn();
  }
}

export function getMotionContainer(selector: string, hostElement: Element): Element {
  return selector ? queryElementFromShadowOrLightDom(selector) || hostElement : hostElement;
}

// TODO: TESTME; REALLY HAVE TO TEST ME HERE!!!
export function getNextAnimationStep(currentAnimationValue: string, animationSteps = DefaultAnimationScript) {
  if (currentAnimationValue === 'off') {
    return 'off';
  }

  if (animationSteps.length < 1) {
    return 'off';
  }

  if (currentAnimationValue === 'on') {
    return animationSteps[0].step;
  }

  const currentAnimationValueIndex = indexOfObjectFromValue(animationSteps, 'step', currentAnimationValue);

  switch (currentAnimationValueIndex) {
    case -1:
      return 'off';
    case animationSteps.length - 1:
      return 'on';
    default:
      return animationSteps[currentAnimationValueIndex + 1].step;
  }
}
