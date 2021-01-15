/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { html } from 'lit-element';
import clone from 'ramda/es/clone.js';
import { createTestElement, removeTestElement } from '@cds/core/test/utils';
import {
  AnimatableElement,
  CLARITY_MOTION_FALLBACK_EASING,
  CLARITY_MOTION_REVERSE_ANIMATION_SUFFIX,
  ClarityMotion,
  LogService,
  PropertyDrivenAnimation,
} from '@cds/core/internal';
import {
  filterAnimationsByUpdatedProperties,
  flattenAndSortAnimations,
  getAnimationConfigForPropertyValue,
  getHidingAndNonHidingPropertyAnimations,
  getPropertyAnimations,
  reverseAnimation,
  reverseAnimationConfig,
  runPropertyAnimations,
  setAnimationProperty,
  sizeDimensionKeyframes,
  zeroOutAnimationConfig,
} from './utils.js';
import { TargetedAnimation } from './interfaces.js';

type PropMap = Map<string, any>;

describe('Animation Helpers: ', () => {
  const mockPropertyAnimation: PropertyDrivenAnimation = {
    hidden: {
      true: 'leave-animation',
      false: 'enter-animation',
    },
    isValid: {
      true: 'validation-passed',
      false: 'validation-failed',
    },
    status: {
      loading: 'loading-animation',
      success: 'success-animation',
      error: 'error-animation',
    },
  };

  const setConfig = [
    {
      target: '.test',
      animation: [{ opacity: 0 }, { opacity: 1 }],
      options: {
        duration: 350,
        easing: 'ease-out',
      },
    },
  ];

  const noConfig = [
    {
      target: '.test',
      animation: [{ opacity: 0 }, { opacity: 1 }],
    },
  ];

  describe('runPropertyAnimations()', () => {
    it('logs a warning if the element it is passed is not animatable', async () => {
      const testElement = await createTestElement(html`<div>ohai</div>`);
      spyOn(LogService, 'warn');
      expect(testElement).toBeDefined();
      runPropertyAnimations(new Map(), (testElement as unknown) as AnimatableElement);
      expect(LogService.warn).toHaveBeenCalled();
      removeTestElement(testElement);
    });
  });

  describe('reverseAnimationConfig() ', () => {
    it('adds expected reverse direction', () => {
      const test = reverseAnimationConfig(clone(setConfig));
      expect(test[0].options.direction).toBe('reverse');
    });

    it('adds expected reverse direction, even if no config options are present', () => {
      const test = reverseAnimationConfig(clone(noConfig));
      expect(test[0].options.direction).toBe('reverse');
    });
  });

  describe('reverseAnimation() ', () => {
    it('adds expected reverse suffix', () => {
      const test = reverseAnimation('animation');
      expect(test).toContain(CLARITY_MOTION_REVERSE_ANIMATION_SUFFIX);
    });
  });

  describe('getAnimationConfigForPropertyValue() ', () => {
    const testConfig = [
      {
        target: '.test',
        animation: [{ opacity: 0 }, { opacity: 1 }],
        options: {
          duration: 350,
          easing: 'ease-out',
        },
      },
    ];

    it('retrieves animation from Clarity Motion as expected', () => {
      ClarityMotion.add('animation', testConfig);
      const test = getAnimationConfigForPropertyValue('animation');
      const testReversed = getAnimationConfigForPropertyValue('animation-reverse');
      expect(test).toEqual(testConfig);
      expect(testReversed).toEqual(testConfig);
    });
  });

  describe('zeroOutAnimationConfig() ', () => {
    it('sets to zero duration and fallback easing as expected', () => {
      const test = zeroOutAnimationConfig(clone(setConfig));
      expect(test[0].options.duration).toBe(0);
      expect(test[0].options.easing).toBe(CLARITY_MOTION_FALLBACK_EASING);
    });

    it('sets config that does not exist to zero duration and fallback easing', () => {
      const test = zeroOutAnimationConfig(clone(noConfig));
      expect(test[0].options.duration).toBe(0);
      expect(test[0].options.easing).toBe(CLARITY_MOTION_FALLBACK_EASING);
    });

    it('sets config that is missing one property to zero duration and fallback easing', () => {
      const halfConfig = [
        {
          target: '.test',
          animation: [{ opacity: 0 }, { opacity: 1 }],
          options: {
            easing: 'ease-out',
          },
        },
      ];
      const test = zeroOutAnimationConfig(halfConfig);
      expect(test[0].options.duration).toBe(0);
      expect(test[0].options.easing).toBe(CLARITY_MOTION_FALLBACK_EASING);
    });

    it('returns empty if the config is completely empty', () => {
      const emptyConfig: TargetedAnimation[] = [];
      const test = zeroOutAnimationConfig(emptyConfig);
      expect(test).toEqual([]);
    });
  });

  describe('setAnimationProperty() ', () => {
    let testElement: HTMLElement;
    let testDiv: HTMLElement;
    // const staticFallback = 'kthxbye';

    const mockTargetedAnimation: TargetedAnimation[] = [
      {
        target: '.test',
        animation: [{ opacity: 0 }, { opacity: 1 }],
        options: {
          easing: '--animation-test',
        },
      },
    ];

    beforeEach(async () => {
      testElement = await createTestElement(
        html`<style>
            .test {
              --animation-test: ease-in;
            }
          </style>
          <div class="test">ohai</div>`
      );
      testDiv = testElement.querySelector<HTMLElement>('.test');
    });

    afterEach(() => {
      removeTestElement(testElement);
    });

    it('sets option property to static fallback if options object exists but does not have expected property', () => {
      const test = setAnimationProperty(
        'duration',
        (testDiv as unknown) as AnimatableElement,
        clone(mockTargetedAnimation),
        250
      );
      expect(test[0].options.duration).toBe(250);
    });

    it('sets option property to css variable value if options object exists and expected property is a css variable name', () => {
      const test = setAnimationProperty(
        'easing',
        (testDiv as unknown) as AnimatableElement,
        clone(mockTargetedAnimation),
        'linear'
      );
      expect(test[0].options.easing).not.toBe('linear');
      expect(test[0].options.easing).toBe('ease-in');
    });

    it('sets option property to static fallback if options object exists, expected property is a css variable name, but there is no value for that css variable', () => {
      const editMock = clone(mockTargetedAnimation);
      editMock[0].options.duration = '--animation-duration';
      const test = setAnimationProperty('duration', (testDiv as unknown) as AnimatableElement, editMock, 500);
      expect(test[0].options.duration).toBe(500);
    });

    it('uses optional valus converter to set option property if options object exists, expected property is a css variable name, and there is a value for that css variable', () => {
      const test = setAnimationProperty(
        'easing',
        (testDiv as unknown) as AnimatableElement,
        clone(mockTargetedAnimation),
        'linear',
        (val: string) => {
          return val + '-out';
        }
      );
      expect(test[0].options.easing).not.toBe('linear');
      expect(test[0].options.easing).toBe('ease-in-out');
    });

    it('sets option property to value in config if options object exists, expected property has a value but is not a css variable', () => {
      const editMock = clone(mockTargetedAnimation);
      editMock[0].options.duration = 750;
      editMock[0].options.easing = 'ease-out';
      let test = setAnimationProperty('duration', (testDiv as unknown) as AnimatableElement, editMock, 500);
      test = setAnimationProperty('easing', (testDiv as unknown) as AnimatableElement, editMock, 'linear', val => {
        return val + '-in';
      });
      expect(test[0].options.duration).not.toBe(500);
      expect(test[0].options.duration).toBe(750);
      expect(test[0].options.easing).not.toBe('linear');
      expect(test[0].options.easing).not.toBe('ease-out-in', 'ignores value converter if not a css property');
      expect(test[0].options.easing).toBe('ease-out');
    });

    it('creates animation config object and sets it to the static fallback if no animation config exists and, thus, no expected property value is present', () => {
      const test = setAnimationProperty(
        'easing',
        (testDiv as unknown) as AnimatableElement,
        clone(noConfig),
        'linear',
        val => {
          return val + '-in';
        }
      );
      expect(test[0].options.easing).toBe('linear');
      expect(test[0].options.easing).not.toBe('linear-in', 'ignores value converter');
    });

    it('handles empty animation config', () => {
      const empty: TargetedAnimation[] = [];
      const test = setAnimationProperty('easing', (testDiv as unknown) as AnimatableElement, empty, 'linear', val => {
        return val + '-in';
      });
      expect(test).toEqual([]);
    });
  });

  describe('filterAnimationsByUpdatedProperties() ', () => {
    it('filters property animations by updated props', () => {
      const updatedProperties: PropMap = new Map([
        ['status', 'error' as any],
        ['isValid', false as any],
      ]);

      const filteredAnims = filterAnimationsByUpdatedProperties(mockPropertyAnimation, updatedProperties);

      expect(!!filteredAnims.status).toBe(true);
      expect(!!filteredAnims.isValid).toBe(true);
      expect(!!filteredAnims.hidden).toBe(false);
    });
    it('returns null if no property animations match updated props', () => {
      const updatedProperties: PropMap = new Map([['ohai', 'howdy' as any]]);

      const filteredAnims = filterAnimationsByUpdatedProperties(mockPropertyAnimation, updatedProperties);

      expect(filteredAnims).toBeNull();
    });
    it('returns null if no property animations are nil or empty', () => {
      const updatedProperties: PropMap = new Map([['ohai', 'howdy' as any]]);

      const nullAnims = filterAnimationsByUpdatedProperties(null, updatedProperties);
      const undefinedAnims = filterAnimationsByUpdatedProperties(void 0, updatedProperties);
      const emptyAnims = filterAnimationsByUpdatedProperties({}, updatedProperties);

      expect(nullAnims).toBeNull();
      expect(undefinedAnims).toBeNull();
      expect(emptyAnims).toBeNull();
    });
  });

  describe('getPropertyAnimations() ', () => {
    const updatedProperties: PropMap = new Map([
      ['status', 'error' as any],
      ['isValid', false as any],
    ]);

    it('returns property animations filtered by updated props', () => {
      getPropertyAnimations(mockPropertyAnimation, updatedProperties).forEach(a => {
        expect(a[0] === 'status' || a[0] === 'isValid').toBe(true);
        expect(a[0] === 'hidden').toBe(false);
      });
    });
    it('returns empty array if animations are nil', () => {
      const testNull = getPropertyAnimations(null, updatedProperties);
      const testUndefined = getPropertyAnimations(void 0, updatedProperties);
      expect(testNull).toEqual([]);
      expect(testUndefined).toEqual([]);
    });
    it('returns empty array if animations are empty', () => {
      const testEmpty = getPropertyAnimations({}, updatedProperties);
      expect(testEmpty).toEqual([]);
    });
  });

  describe('getHidingAndNonHidingPropertyAnimations() ', () => {
    it('returns tuple of property animations categorized by hiding vs. not hiding', () => {
      const [hiding, other] = getHidingAndNonHidingPropertyAnimations(mockPropertyAnimation);
      expect(hiding.length === 1).toBe(true);
      expect(hiding[0][0]).toBe('hidden');
      expect(other.length === 2).toBe(true);
      expect(other[0][0] === 'isValid' || other[0][0] === 'status').toBe(true);
      expect(other[1][0] === 'isValid' || other[1][0] === 'status').toBe(true);
    });
    it('returns empty array as first element if no hiding animations are defined', () => {
      const [hiding, other] = getHidingAndNonHidingPropertyAnimations({ status: { error: 'error-animation' } });
      expect(hiding.length === 0).toBe(true);
      expect(other.length === 1).toBe(true);
      expect(other[0][0] === 'status').toBe(true);
    });
    it('returns empty array as   element if only hiding animations are defined', () => {
      const [hiding, other] = getHidingAndNonHidingPropertyAnimations({ hidden: { true: 'fade-animation' } });
      expect(hiding.length === 1).toBe(true);
      expect(hiding[0][0] === 'hidden').toBe(true);
      expect(other.length === 0).toBe(true);
    });
    it('returns empty tuple if passed nil or empty properties', () => {
      const testNull = getHidingAndNonHidingPropertyAnimations(null);
      const testUndefined = getHidingAndNonHidingPropertyAnimations(void 0);
      const testEmpty = getHidingAndNonHidingPropertyAnimations({});
      expect(testNull).toEqual([[], []]);
      expect(testUndefined).toEqual([[], []]);
      expect(testEmpty).toEqual([[], []]);
    });
  });

  describe('flattenAndSortAnimations() ', () => {
    const hidingAndOtherTuple = getHidingAndNonHidingPropertyAnimations(mockPropertyAnimation);

    it('puts hiding animations last if hiding', () => {
      const flatAnimations = flattenAndSortAnimations(hidingAndOtherTuple, true);
      expect(flatAnimations[0][0]).not.toBe('hidden');
      expect(flatAnimations[flatAnimations.length - 1][0]).toBe('hidden');
    });
    it('puts hiding animations first if showing', () => {
      const flatAnimations = flattenAndSortAnimations(hidingAndOtherTuple, false);
      expect(flatAnimations[0][0]).toBe('hidden');
      expect(flatAnimations[flatAnimations.length - 1][0]).not.toBe('hidden');
    });
    it('returns only non-hiding animations if those are the only ones defined', () => {
      const flatAnimations = flattenAndSortAnimations(
        [
          [],
          [
            [
              'status',
              {
                error: 'error-animation',
              },
            ],
          ],
        ],
        true
      );
      expect(flatAnimations[0][0]).toBe('status');
      expect(flatAnimations.length === 1).toBe(true);
    });
    it('returns only hiding animations if those are the only ones defined', () => {
      const flatAnimations = flattenAndSortAnimations(
        [
          [
            [
              'hidden',
              {
                true: 'show-animation',
              },
            ],
          ],
          [],
        ],
        false
      );
      expect(flatAnimations[0][0]).toBe('hidden');
      expect(flatAnimations.length === 1).toBe(true);
    });
    it('returns empty array if passed an empty or nil tuple', () => {
      const testNull = flattenAndSortAnimations(null, false);
      const testUndefined = flattenAndSortAnimations(undefined, false);
      const testEmpty = flattenAndSortAnimations([[], []], false);
      expect(testNull).toEqual([]);
      expect(testUndefined).toEqual([]);
      expect(testEmpty).toEqual([]);
    });
  });

  describe('sizeDimensionKeyframes() ', () => {
    let testElement: HTMLElement;
    let nopeElement: HTMLElement;

    beforeEach(async () => {
      testElement = await createTestElement(html`<div class="test" style="width: 100px; height: 80px">ohai</div>`);
      nopeElement = await createTestElement(html`<div class="nope" style="width: 100px; height: 80px">ohai</div>`);
    });

    afterEach(() => {
      removeTestElement(testElement);
      removeTestElement(nopeElement);
    });

    it('passes keyframes through if no height/width specified', () => {
      const keyframes = [{ opacity: 0 }, { opacity: 1 }];
      const modifiedKeyframes = sizeDimensionKeyframes(keyframes, document.body);
      expect(modifiedKeyframes).toEqual(keyframes);
    });

    it('returns property indexed keyframes if passed them instead of an array of keyframes', () => {
      const pIkeyframes = { transform: ['rotate(0deg)', 'rotate(360deg)'] };
      const modifiedKeyframes = sizeDimensionKeyframes(pIkeyframes, document.body);
      expect(modifiedKeyframes).toEqual(pIkeyframes);
    });

    it('passes keyframes through if they only have normal heights', () => {
      const keyframes = [
        { opacity: 0, height: '0' },
        { opacity: 1, height: '800px' },
      ];
      const modifiedKeyframes = sizeDimensionKeyframes(keyframes, document.body);
      expect(modifiedKeyframes).toEqual(keyframes);
    });

    it('passes keyframes through if they only have normal widths', () => {
      const keyframes = [
        { opacity: 0, width: '0' },
        { opacity: 1, width: '800px' },
      ];
      const modifiedKeyframes = sizeDimensionKeyframes(keyframes, document.body);
      expect(modifiedKeyframes).toEqual(keyframes);
    });

    it('updates heights in keyframes that ask for lookups', () => {
      const keyframes = [
        { opacity: 0, height: '0' },
        { opacity: 1, height: 'from:.test' },
      ];
      const modifiedKeyframes = sizeDimensionKeyframes(keyframes, testElement) as Keyframe[];
      expect(modifiedKeyframes[0]).toEqual({ opacity: 0, height: '0' });
      expect(modifiedKeyframes[1]).toEqual({ opacity: 1, height: '80px' });
    });

    it('updates widths in keyframes that ask for lookups', () => {
      const keyframes = [
        { opacity: 0, width: '0' },
        { opacity: 1, width: 'from:.test' },
      ];
      const modifiedKeyframes = sizeDimensionKeyframes(keyframes, testElement) as Keyframe[];
      expect(modifiedKeyframes[0]).toEqual({ opacity: 0, width: '0' });
      expect(modifiedKeyframes[1]).toEqual({ opacity: 1, width: '100px' });
    });

    it('sets height to auto in keyframes where the lookup fails', () => {
      const keyframes = [
        { opacity: 0, height: '0' },
        { opacity: 1, height: 'from:.test' },
      ];
      const modifiedKeyframes = sizeDimensionKeyframes(keyframes, nopeElement) as Keyframe[];
      expect(modifiedKeyframes[0]).toEqual({ opacity: 0, height: '0' });
      expect(modifiedKeyframes[1]).toEqual({ opacity: 1, height: 'auto' });
      expect(modifiedKeyframes[1]).not.toEqual({ opacity: 1, height: '100px' });
    });

    it('sets width to auto in keyframes where the lookup fails', () => {
      const keyframes = [
        { opacity: 0, width: '0' },
        { opacity: 1, width: 'from:.test' },
      ];
      const modifiedKeyframes = sizeDimensionKeyframes(keyframes, nopeElement) as Keyframe[];
      expect(modifiedKeyframes[0]).toEqual({ opacity: 0, width: '0' });
      expect(modifiedKeyframes[1]).toEqual({ opacity: 1, width: 'auto' });
      expect(modifiedKeyframes[1]).not.toEqual({ opacity: 1, width: '100px' });
    });
  });
});
