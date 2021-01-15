/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AnimatableElement,
  AnimationStatus,
  CLARITY_MOTION_ENTER_LEAVE_PROPERTY,
  CLARITY_MOTION_FALLBACK_DURATION_IN_MS,
  CLARITY_MOTION_FALLBACK_EASING,
  CLARITY_MOTION_REVERSE_ANIMATION_LABEL,
  CLARITY_MOTION_REVERSE_ANIMATION_SUFFIX,
  PropertyDrivenAnimation,
  TargetedAnimation,
  TargetedAnimationAsPropertyTuple,
} from './interfaces.js';
import { LogService } from '../services/log.service.js';
import { ClarityMotion } from './motion.service.js';
import clone from 'ramda/es/clone.js';
import { getCssPropertyValue, isCssPropertyName } from '../utils/css.js';
import { isPrefixedBy, isSuffixedBy, getNumericValueFromCssSecondsStyleValue, removePrefix } from '../utils/string.js';
import { queryChildFromLightOrShadowDom } from '../utils/dom.js';
import { allPropertiesPass, getMillisecondsFromSeconds } from '../utils/identity.js';

export async function runPropertyAnimations(props: Map<string, any>, hostEl: AnimatableElement) {
  if (!hostEl._animations) {
    LogService.warn(`${hostEl.tagName.toLocaleLowerCase()} is trying to animate but no animations are defined.`);
    return;
  }

  // this runs through animations for each property sequentially
  getPropertyAnimations(hostEl._animations, props).forEach(
    async (propNameAnimationTuple: TargetedAnimationAsPropertyTuple) => {
      const [propname, propertyAnimationsByValue] = propNameAnimationTuple;

      if (props.get(propname) === hostEl[propname]) {
        // a weird/unlikely state where an update is sent but the property value didn't actually change
        return;
      }

      // gets animations to run based on the property's value

      const animatedPropertyValueAsString = propertyAnimationsByValue[hostEl[propname].toString()];
      let motionForMyValue: TargetedAnimation[] = getAnimationConfigForPropertyValue(animatedPropertyValueAsString);

      // jumps out if there are no animation routines... needs to be up higher in this sequence
      if (motionForMyValue.length < 1) {
        return;
      }

      if (animationIsReversed(animatedPropertyValueAsString)) {
        motionForMyValue = reverseAnimationConfig(motionForMyValue);
      }

      if (hostEl.cdsMotion && hostEl.cdsMotion !== 'off') {
        // sets duration and easing based on CSS properties, passed values, or a global fallback
        motionForMyValue = setAnimationDuration(motionForMyValue, hostEl);
        motionForMyValue = setAnimationEasing(motionForMyValue, hostEl);
      } else {
        // cdsMotion is turned off, so zero out the duration
        motionForMyValue = zeroOutAnimationConfig(motionForMyValue);
      }

      // loops through animation config and runs them; assigns the promises to an array we can Promise.all() at the end
      const animations = motionForMyValue.map(config => {
        // does not allow animation to run if the onlyIf prop:value string doesn't let us
        if (config.onlyIf && !allPropertiesPass(hostEl, config.onlyIf)) {
          return true;
        }

        // accesses and manipulates the private animation status attr;
        if (hostEl.getAttribute('_cds-animation-status') !== AnimationStatus.active) {
          hostEl.setAttribute('_cds-animation-status', AnimationStatus.active);
          // this is here so we only emit the start event once, right when the whole animation starts...
          hostEl.motionChange.emit(`${animatedPropertyValueAsString} animation ${AnimationStatus.start}`);
        }

        return new Promise(resolve => {
          const animationTarget = queryChildFromLightOrShadowDom(config.target, hostEl) || hostEl;
          const animationConfig = !Array.isArray(config.animation)
            ? config.animation
            : sizeDimensionKeyframes(config.animation, hostEl);
          const animationPlayer = animationTarget.animate(animationConfig, config.options || {});
          const listener = () => {
            resolve('animation finished');
            animationPlayer.removeEventListener('finish', listener);
          };

          animationPlayer.addEventListener('finish', listener);
        });
      });

      // wait for all the concurrent property animations to finish
      await Promise.all(animations);

      // sets super secret animation attr back to 'ready'
      hostEl.setAttribute('_cds-animation-status', AnimationStatus.ready); // A

      // emits the name of the animation and that it ended
      hostEl.motionChange.emit(`${animatedPropertyValueAsString} animation ${AnimationStatus.end}`); // A
    }
  );
}

// reversing utils
export function animationIsReversed(nameOfAnimation: string) {
  return isSuffixedBy(nameOfAnimation, CLARITY_MOTION_REVERSE_ANIMATION_SUFFIX);
}

export function reverseAnimationConfig(config: TargetedAnimation[]): TargetedAnimation[] {
  return config.map((anim: TargetedAnimation) => {
    if (anim.options) {
      anim.options.direction = CLARITY_MOTION_REVERSE_ANIMATION_LABEL;
    } else {
      anim.options = { direction: CLARITY_MOTION_REVERSE_ANIMATION_LABEL };
    }
    return anim;
  });
}

export function reverseAnimation(animationName: string) {
  return [animationName, '-', CLARITY_MOTION_REVERSE_ANIMATION_LABEL].join('');
}

// animation config retrieval
export function getAnimationConfigForPropertyValue(nameOfAnimation: string): TargetedAnimation[] {
  const isReversed = animationIsReversed(nameOfAnimation);
  const animationLookup = isReversed
    ? nameOfAnimation.slice(0, -1 * CLARITY_MOTION_REVERSE_ANIMATION_SUFFIX.length)
    : nameOfAnimation;

  return clone(ClarityMotion.get(animationLookup));
}

// setting animation config values
export function setAnimationDuration(config: TargetedAnimation[], hostEl: AnimatableElement): TargetedAnimation[] {
  return setAnimationProperty('duration', hostEl, config, CLARITY_MOTION_FALLBACK_DURATION_IN_MS, (val: string) => {
    return getMillisecondsFromSeconds(getNumericValueFromCssSecondsStyleValue(val));
  });
}

export function setAnimationEasing(config: TargetedAnimation[], hostEl: AnimatableElement): TargetedAnimation[] {
  return setAnimationProperty('easing', hostEl, config, CLARITY_MOTION_FALLBACK_EASING);
}

export function zeroOutAnimationConfig(config: TargetedAnimation[]): TargetedAnimation[] {
  return config.map(anim => {
    if (anim.options) {
      anim.options.duration = 0;
      anim.options.easing = CLARITY_MOTION_FALLBACK_EASING;
    } else {
      anim.options = { duration: 0, easing: CLARITY_MOTION_FALLBACK_EASING };
    }
    return anim;
  });
}

export function setAnimationProperty(
  propertyName: string,
  hostEl: AnimatableElement,
  config: TargetedAnimation[],
  staticFallback: string | number,
  valueConverter?: (arg: string) => string | number
) {
  return config.map((anim: TargetedAnimation) => {
    if (anim.options) {
      if (!(anim.options as { [key: string]: string | number })[propertyName]) {
        (anim.options as { [key: string]: string | number })[propertyName] = staticFallback;
      } else if (isCssPropertyName((anim.options as { [key: string]: any })[propertyName])) {
        const myConfigOption = (anim.options as { [key: string]: string | number })[propertyName];
        let valFromProperty: string | number = getCssPropertyValue(myConfigOption as string, hostEl);

        if (!valFromProperty) {
          valFromProperty = staticFallback;
        } else if (valueConverter) {
          valFromProperty = valueConverter(valFromProperty);
        }

        (anim.options as { [key: string]: string | number })[propertyName] = valFromProperty;
      }
      // else fallthrough not required because option is already set to intended value
    } else {
      const newConfigOptions: { [key: string]: string | number } = {};
      newConfigOptions[propertyName] = staticFallback;
      anim.options = newConfigOptions;
    }
    return anim;
  });
}

// work on turning property animation objects to animation config objects
export function sizeDimensionKeyframes(
  animationKeyframes: Keyframe[] | PropertyIndexedKeyframes,
  hostEl: Element
): Keyframe[] | PropertyIndexedKeyframes {
  if (!Array.isArray(animationKeyframes)) {
    return animationKeyframes;
  }

  return animationKeyframes.map((kf: Keyframe) => {
    if (kf?.hasOwnProperty('height') && isPrefixedBy(kf?.height?.toString() || '', 'from:')) {
      const selector = removePrefix(kf?.height?.toString() || '', 'from:');
      const measureTarget = queryChildFromLightOrShadowDom(selector, hostEl) || null;
      kf.height = !measureTarget ? 'auto' : measureTarget.getBoundingClientRect().height + 'px';
    }
    if (kf?.hasOwnProperty('width') && isPrefixedBy(kf?.width?.toString() || '', 'from:')) {
      const selector = removePrefix(kf?.width?.toString() || '', 'from:');
      const measureTarget = queryChildFromLightOrShadowDom(selector, hostEl) || null;
      kf.width = !measureTarget ? 'auto' : measureTarget.getBoundingClientRect().width + 'px';
    }
    return kf;
  });
}

export function filterAnimationsByUpdatedProperties(
  animations: PropertyDrivenAnimation,
  updatingProps: Map<string, any>
): PropertyDrivenAnimation | null {
  if (animations === null || animations === undefined || animations === {}) {
    return null;
  }

  let objectIsEmpty = true;
  const returnObject: PropertyDrivenAnimation = {};

  Object.getOwnPropertyNames(animations).forEach((prop: string) => {
    if (updatingProps.has(prop)) {
      returnObject[prop] = clone(animations[prop]);
      objectIsEmpty = false;
    }
  });

  return objectIsEmpty ? null : returnObject;
}

type TupleOfHiddenAndOtherAnimations = [TargetedAnimationAsPropertyTuple[], TargetedAnimationAsPropertyTuple[]];

export function flattenAndSortAnimations(
  hiddenAndNotAnimationTuple: TupleOfHiddenAndOtherAnimations,
  isHiding: boolean
): TargetedAnimationAsPropertyTuple[] {
  if (hiddenAndNotAnimationTuple === null || hiddenAndNotAnimationTuple === undefined) {
    return [];
  }

  const [hiddenAnimations, otherAnimations] = hiddenAndNotAnimationTuple;

  if (hiddenAnimations.length > 0) {
    if (isHiding) {
      // hiding hostEl
      return [].concat(otherAnimations as never[], hiddenAnimations as never[]);
    } else {
      // showing hostEl
      return [].concat(hiddenAnimations as never[], otherAnimations as never[]);
    }
  } else {
    return otherAnimations;
  }
}

export function getHidingAndNonHidingPropertyAnimations(
  animations: PropertyDrivenAnimation
): [TargetedAnimationAsPropertyTuple[], TargetedAnimationAsPropertyTuple[]] {
  const hiddenAnimations: TargetedAnimationAsPropertyTuple[] = [];
  const otherAnimations: TargetedAnimationAsPropertyTuple[] = [];

  Object.getOwnPropertyNames(animations || {}).forEach((prop: string) => {
    const animationTuple: TargetedAnimationAsPropertyTuple = [prop, clone(animations[prop])];
    if (prop === CLARITY_MOTION_ENTER_LEAVE_PROPERTY) {
      hiddenAnimations.push(animationTuple);
    } else {
      otherAnimations.push(animationTuple);
    }
  });

  return [hiddenAnimations, otherAnimations];
}

export function getPropertyAnimations(
  animations: PropertyDrivenAnimation,
  updatingProps: Map<string, any>
): TargetedAnimationAsPropertyTuple[] {
  const activeAnimations = filterAnimationsByUpdatedProperties(animations || {}, updatingProps);

  if (activeAnimations === null) {
    return [];
  }

  const hidingAndOtherAnimationsAsTuple = getHidingAndNonHidingPropertyAnimations(activeAnimations);
  const isHiding = updatingProps.get(CLARITY_MOTION_ENTER_LEAVE_PROPERTY);

  return flattenAndSortAnimations(hidingAndOtherAnimationsAsTuple, isHiding);
}
