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
} from '../utils/identity.js';
import { sleep } from '../utils/async.js';
import { EventEmitter } from '../decorators/event.js';

type Animator = Element & {
  motionReady: boolean;
  motionTrigger: string;
  cdsMotion: string;
  motionChange: EventEmitter<string>;
  motionSequence: AnimationStep[];
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

// TODO: TESTME
// encapsulating this to keep our super-classes light
export function onAnimatableUpdate(props: Map<string, any>, hostEl: Animator): void {
  if (hostEl.cdsMotion !== 'off' && props.has(hostEl.motionTrigger)) {
    runAnimation(props, hostEl);
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
  const stepDurationValue = getStepDurationValue(step.duration, hostEl);

  if (stepDurationValue === 0) {
    // hold up for a bit then apply step value
    runStaticAnimationStep(step, hostEl);
  } else {
    // apply step value, then give time for animation to run
    hostEl.cdsMotion = step.value;
    hostEl.motionChange.emit(`${step.value}`);
    await sleep(stepDurationValue + stepNudge);
    hostEl.motionChange.emit(`${step.value} complete`);
  }
}

// TODO: TESTME
export async function runStaticAnimationStep(step: AnimationStep, hostEl: Animator) {
  await sleep(100);
  hostEl.cdsMotion = step.value;
}

// TODO: TESTME
export function runAnimation(props: Map<string, any>, hostEl: Animator) {
  // TODO: 'hidden' needs to be motion trigger
  if (props.has('hidden') && hostEl.cdsMotion !== 'off') {
    if (!hostEl.motionReady) {
      hostEl.motionReady = true; // avoid firstpass run through
    } else {
      const nextStep = getNextAnimationStep(hostEl.cdsMotion, hostEl.motionSequence || []);

      if (nextStep.value === 'on' || nextStep.value === 'off') {
        runStaticAnimationStep(nextStep, hostEl);
      } else {
        runTimedAnimationStep(nextStep, hostEl);
      }
    }
  }
}
