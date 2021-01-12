/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LitElement } from 'lit-element';
import { CdsBaseFocusTrap } from './focus-trap.base.js';
import { property } from '../decorators/property.js';
import { event, EventEmitter } from '../decorators/event.js';
import { Animatable, AnimationStep, DefaultAnimationScript } from '../animatable/interfaces.js';
import { getMotionContainer, onAnimatableUpdate } from '../animatable/utils.js';

export class CdsAnimatable extends LitElement implements Animatable {
  motionReady = false;
  motionScript: AnimationStep[] = DefaultAnimationScript;
  motionContainerSelector: string;

  get motionContainer() {
    return getMotionContainer(this.motionContainerSelector, this);
  }

  // TODO: TESTME
  @event() protected motionChange: EventEmitter<string>;

  // TODO: TESTME
  @property({ type: String })
  motionTrigger = 'hidden';

  // TODO: TESTME
  @property({ type: String })
  motion = 'off';

  updated(props: Map<string, any>) {
    // check and update timing before each run
    onAnimatableUpdate(props, this as any); // 'any' here required to keep typescript happy
    super.updated(props);
  }
}

export class CdsAnimatableFocusTrap extends CdsBaseFocusTrap implements Animatable {
  motionReady = false;
  motionScript: AnimationStep[] = DefaultAnimationScript;
  motionContainerSelector: string;

  get motionContainer() {
    return getMotionContainer(this.motionContainerSelector, this);
  }

  // TODO: TESTME
  @event() protected motionChange: EventEmitter<string>;

  // TODO: TESTME
  @property({ type: String })
  motionTrigger = 'hidden';

  // TODO: TESTME
  @property({ type: String })
  motion = 'off';

  updated(props: Map<string, any>) {
    // check and update timing before each run
    onAnimatableUpdate(props, this as any); // 'any' here required to keep typescript happy
    super.updated(props);
  }
}
