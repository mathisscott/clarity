/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { indexOfObjectFromValue } from '../utils/array.js';
import { queryElementFromShadowOrLightDom } from '../utils/dom.js';
import { AnimationStep, AnimationStepValues, DefaultAnimationSequence } from './interfaces.js';
import { getCssPropertyValue, isCssPropertyName } from '../utils/css.js';
import {
  getMillisecondsFromSeconds,
  getNumericValueFromCssSecondsStyleValue,
  isNumericString,
  isString,
  isNilOrEmpty,
} from '../utils/identity.js';
import { sleep } from '../utils/async.js';
import { EventEmitter } from '../decorators/event.js';

type Animator = Element & {
  motionActive: boolean;
  motionReady: boolean;
  motionTrigger: string;
  cdsMotion: string;
  motionChange: EventEmitter<string>;
  motionSequence: AnimationStep[];
  cdsMotionType: string;
  cdsMotionTypes: string;
};

// TODO: TESTME
export function getMotionContainer(selector: string, hostElement: Element): Element {
  return selector ? queryElementFromShadowOrLightDom(selector) || hostElement : hostElement;
}

// TODO: TESTME; REALLY HAVE TO TEST ME HERE!!!
export function getNextAnimationStep(
  currentAnimationValue: string,
  animationSteps = DefaultAnimationSequence
): AnimationStep {
  if (animationSteps.length < 1 || currentAnimationValue === 'off') {
    return { value: AnimationStepValues.Disabled };
  }

  if (currentAnimationValue === 'on') {
    return animationSteps[0];
  }

  const currentAnimationValueIndex = indexOfObjectFromValue(animationSteps, 'step', currentAnimationValue);

  switch (currentAnimationValueIndex) {
    case -1:
      return { value: AnimationStepValues.Disabled };
    case animationSteps.length - 1:
      return { value: AnimationStepValues.Enabled };
    default:
      return animationSteps[currentAnimationValueIndex + 1];
  }
}

// TODO: TESTME
export function getTimingInMillisecondsFromToken(timingPropertyName: string, hostEl: Element) {
  const propString = getCssPropertyValue(timingPropertyName, hostEl);
  const propNumericInSeconds = getNumericValueFromCssSecondsStyleValue(propString);
  return getMillisecondsFromSeconds(propNumericInSeconds);
}

// TODO: TESTME IF STILL NEEDED
export function getAnimationValue(stepValue: string | (() => string)): string {
  switch (true) {
    case isNilOrEmpty(stepValue):
      return '';
    case isString(stepValue):
      return stepValue as string;
    default:
      return (stepValue as () => string)();
  }
}

// TODO: TESTME AND MOVE TO ARRAY UTILS
export function pluckNextValue<T>(ary: T[], currentValue: T): T | null {
  const currentIndex = ary.indexOf(currentValue);

  if (currentIndex === -1) {
    if (ary.length < 1) {
      return null;
    } else {
      return ary[0];
    }
  }

  if (ary.length < 1) {
    return null;
  }

  if (ary.length === 1) {
    return ary[0];
  }

  if (currentIndex + 1 >= ary.length) {
    return ary[0];
  }

  return ary[currentIndex + 1];
}

// TODO: TESTME
// encapsulating this to keep our super-classes light
export async function onAnimatableUpdate(props: Map<string, any>, hostEl: Animator) {
  console.log('🟡: ohai');

  if (hostEl.cdsMotion !== 'off' && props.has(hostEl.motionTrigger) && !hostEl.motionActive) {
    console.log('🟡: animation is running on: ', hostEl);

    const motionTypesAsArray = hostEl.cdsMotionTypes.split(' ');

    // set animation type <= functionalize?
    if (!hostEl.cdsMotionType) {
      hostEl.cdsMotionType = motionTypesAsArray[0];
    } else {
      hostEl.cdsMotionType = pluckNextValue(motionTypesAsArray, hostEl.cdsMotionType) as string;
    }

    await runAnimation(hostEl);
  } else {
    console.log('🔴: animation or update is being skipped on: ', hostEl);
  }
}

// TODO: TESTME
export function getStepDurationValue(stepDuration: string, hostEl: Element = document.body): number {
  const stepDurationIsNumeric = isNumericString(stepDuration) && stepDuration.indexOf('.') < 0; // assumes numeric string in milliseconds
  const stepDurationIsCssProp = isCssPropertyName(stepDuration);

  switch (true) {
    case stepDurationIsNumeric:
      return +stepDuration;
    case stepDurationIsCssProp:
      return getMillisecondsFromSeconds(
        getNumericValueFromCssSecondsStyleValue(getCssPropertyValue(stepDuration, hostEl))
      );
    default:
      return 0;
  }
}

// TODO: TESTME
export async function runTimedAnimationStep(step: AnimationStep, hostEl: Animator) {
  const stepNudge = 10;
  const stepDuration = step.duration || '0';
  const stepDurationValue = getStepDurationValue(stepDuration, hostEl);

  console.log('🟣: step = ', step.value);
  console.log('🟣: stepDurationValue = ', stepDurationValue);

  if (stepDurationValue === 0) {
    // hold up for a bit then apply step value
    console.log('🟣: no step duration');
    runStaticAnimationStep(step, hostEl);
  } else {
    // apply step value, then give time for animation to run
    hostEl.cdsMotion = getAnimationValue(step.value);
    await sleep(stepDurationValue + stepNudge);
  }
}

// TODO: TESTME
export async function runStaticAnimationStep(step: AnimationStep, hostEl: Animator) {
  await sleep(100);
  console.log('⭕️: static run');
  hostEl.cdsMotion = getAnimationValue(step.value);
}

// TODO: TESTME
export async function runAnimation(hostEl: Animator) {
  if (hostEl.cdsMotion === 'off') {
    console.log('🔴: treating as off');
    return;
  }

  console.log('🔵: ohai');

  if (!hostEl.motionReady) {
    // TODO: STILL NECESSARY?!
    console.log('🔵: motion ready...');
    hostEl.motionReady = true; // avoid firstpass run through
  } else {
    // append 'on' to the end so it cycles back
    const animationSequence: AnimationStep[] = [...hostEl.motionSequence, { value: AnimationStepValues.Enabled }];

    hostEl.motionChange.emit(`${hostEl.cdsMotionType} begin`);
    await animationSequence.forEach(async (stp: AnimationStep) => {
      const val = stp.value;
      if (val === 'on' || val === 'off') {
        console.log('🔴: static step; value = ', val);
        runStaticAnimationStep(stp, hostEl);
      } else {
        console.log('🟢: active step; value = ', val);
        await runTimedAnimationStep(stp, hostEl);
      }
    });
    hostEl.motionChange.emit(`${hostEl.cdsMotionType} complete`);
  }
}
