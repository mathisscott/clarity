/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { indexOfObjectFromValue } from '../utils/array.js';
import { queryElementFromShadowOrLightDom } from '../utils/dom.js';
import { AnimationStep, DefaultAnimationScript } from './interfaces.js';
import { getCssPropertyValue } from '../utils/css.js';
import { getMillisecondsFromSeconds, getNumericValueFromCssSecondsStyleValue } from '../utils/identity.js';
import { sleep } from '../utils/async.js';

// TODO: TESTME
export function checkPropsForMotionTrigger(trigger: string, props: Map<string, any>) {
  return props.has(trigger);
}

// TODO: TESTME
export function checkPropsAndRunAnimation(trigger: string, props: Map<string, any>, runFn: () => void, timing = 300) {
  if (checkPropsForMotionTrigger(trigger, props) && timing) {
    runFn();
  }
}

// TODO: TESTME
export function getMotionContainer(selector: string, hostElement: Element): Element {
  return selector ? queryElementFromShadowOrLightDom(selector) || hostElement : hostElement;
}

// TODO: TESTME; REALLY HAVE TO TEST ME HERE!!!
export function getNextAnimationStep(currentAnimationValue: string, animationSteps = DefaultAnimationScript) {
  if (animationSteps.length < 1 || currentAnimationValue === 'off') {
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

// TODO: TESTME
export function getTimingInMillisecondsFromToken(timingPropertyName: string, hostEl: Element) {
  const propString = getCssPropertyValue(timingPropertyName, hostEl);
  const propNumericInSeconds = getNumericValueFromCssSecondsStyleValue(propString);
  return getMillisecondsFromSeconds(propNumericInSeconds);
}

// this class only exists to make typescript happy...
class Animator extends Element implements Animatable {
  motion: string;
  motionReady: boolean;
  motionScript: AnimationStep[];
  motionTrigger: string;
  motionRun() {}
  updated(props: Map<string, any>) {
    if (props) {
      return;
    }
    return;
  }
}

// TODO: TESTME
// encapsulating this to keep our super-classes light
export function onAnimatableUpdate(props: Map<string, any>, hostEl: Animator): void {
  if (hostEl.motion === 'off') {
    return;
  }
  const timingToken = hostEl.hasAttribute('hidden') ? '--cds-global-animation-3' : '--cds-global-animation-4';
  const timing = getTimingInMillisecondsFromToken(timingToken, hostEl);

  if (hostEl.motion !== 'off' && timing === 0) {
    hostEl.motion = 'off';
  } else {
    checkPropsAndRunAnimation(hostEl.motionTrigger, props, hostEl.motionRun, timing);
  }
}

// TODO: TESTME
export async function runAnimation(props: Map<string, any>, hostEl: Animator) {
  if (props.has('hidden') && hostEl.motion !== 'off') {
    if (!hostEl.motionReady) {
      hostEl.motionReady = true; // avoid firstpass run through
    } else {
      await sleep(100);

      // LEFTOFF: ANIMATION RUN GOES HERE!
    }
  }
}
