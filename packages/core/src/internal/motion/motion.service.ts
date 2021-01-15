/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { MotionRegistry, TargetedAnimation } from './interfaces.js';

const registry: MotionRegistry = {};

const motionRegistry = new Proxy(registry, {
  set: (target, key: string, value) => {
    target[key] = value;
    return true;
  },
});

/**
 *
 * TODO: WRITE DOX HERE
 * TODO: TESTME
 *
 */
export class ClarityMotion {
  /**
   * Returns a readonly reference of the registry of animations.
   */
  static get registry(): Readonly<MotionRegistry> {
    return motionRegistry;
  }

  static get(name: string): TargetedAnimation[] {
    return motionRegistry[name] || [];
  }

  static add(animationName: string, animationConfig: TargetedAnimation[]) {
    if (!animationName || !animationConfig) {
      return;
    }
    motionRegistry[animationName] = animationConfig;
  }
}
