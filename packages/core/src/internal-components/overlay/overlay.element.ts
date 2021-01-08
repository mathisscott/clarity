/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  baseStyles,
  createId,
  CdsBaseFocusTrap,
  event,
  EventEmitter,
  FocusTrapTracker,
  internalProperty,
  isNumericString,
  MotionValues,
  onKey,
  property,
} from '@cds/core/internal';
import { html, query } from 'lit-element';
import { styles } from './overlay.element.css.js';

// TODO: THIS SHOULD BE A UTILITY FUNCTION
function sleep(millisecondsToWait = 10) {
  return new Promise(resolve => setTimeout(resolve, millisecondsToWait));
}

// TODO: THIS SHOULD BE A UTILITY FUNCTION
function getMillisecondsFromSecondsStyleValue(styleValueInSeconds: string): number {
  // '1.02s'
  const secondsStringChecker = /(\d+)?\.?(\d+)?s/g;
  if (!styleValueInSeconds || !styleValueInSeconds.match(secondsStringChecker)) {
    return 0; // validate expected input
  }
  const copyVal = styleValueInSeconds.substr(0, styleValueInSeconds.length - 1); // cut off trailing 's'

  if (isNumericString(copyVal)) {
    return Number(copyVal) * 1000;
  }

  return 0;
  // 1020
}

// TODO: ENTER/LEAVE ROUTINES
const animationPlans: Map<string, MotionValues[]> = new Map();
animationPlans.set('enter', ['enter-start', 'enter-end']);
animationPlans.set('leave', ['leave-start', 'leave-end', 'on']);

export function isNestedOverlay(myId: string, overlayPrefix: string, trapIds: string[]): boolean {
  const overlayIds = trapIds.filter(id => id.indexOf(overlayPrefix) > -1);
  return overlayIds.indexOf(myId) > 0; // id is present and not the first one...
}

export function overlayIsActive(overlayId: string, focusTrapService = FocusTrapTracker) {
  return focusTrapService.getCurrentTrapId() === overlayId;
}

export function nextAnimationStep(currentAnimationStep: MotionValues): MotionValues {
  switch (currentAnimationStep) {
    case 'off':
      return 'off';
    case 'on':
      return 'enter-start';
    case 'enter-start':
      return 'enter-end';
    case 'enter-end':
      return 'leave-start';
    case 'leave-start':
      return 'leave-end';
    case 'leave-end':
      return 'on';
  }
}

type CloseChangeSources = 'backdrop-click' | 'escape-keypress' | 'close-button-click' | 'custom';

/**
 *
 * ```typescript
 * import '@cds/core/internal-components/overlay/register.js';
 * ```
 *
 * ```html
 * <cds-internal-overlay>
 *  <section cds-layout="vertical align:horizontal-stretch">
 *    <div cds-layout="vertical pad:md gap:md">
 *      <h2 cds-text="display">A Title</h2>
 *      <div>
 *        <p cds-text="body">
 *          Content inside a generic overlay.
 *        </p>
 *      </div>
 *    </div>
 *  </section>
 * </cds-internal-overlay>
 * ```
 *
 * @beta
 * @element cds-internal-overlay
 * @slot - Content slot for the content inside the overlay's panel
 * @event closeChange - Notify user when close event has occurred
 * @cssprop --backdrop-background
 * @cssprop --layered-backdrop-background
 */
export class CdsInternalOverlay extends CdsBaseFocusTrap {
  @property({ type: String })
  ariaModal = 'true';

  protected animationIn = 'cds-animation-in';
  protected animationOut = 'cds-animation-out';

  private initted = false;

  @property({ type: String, required: 'warning' })
  role = 'dialog';

  // renderRoot needs delegatesFocus so that focus can cross the shadowDOM
  // inside an element with aria-modal set to true
  protected createRenderRoot(): Element | ShadowRoot {
    return this.attachShadow({ mode: 'open', delegatesFocus: true });
  }

  private overlayIdPrefix = '_overlay-';

  @event() protected closeChange: EventEmitter<CloseChangeSources>;

  @property({ type: String })
  cdsMotion: MotionValues = 'on';
  // TODO: need an example of this ! => 'end' MutationObserver watches for this value!

  @internalProperty({ type: Boolean })
  protected isLayered = false;

  @query('.overlay-backdrop') protected backdrop: HTMLElement;

  firstUpdated(props: Map<string, any>) {
    super.firstUpdated(props);
    this.backdrop.addEventListener('click', this.fireEventOnBackdropClick);
  }

  updated(props: Map<string, any>) {
    const oldLayered = this.isLayered;
    const isNested = isNestedOverlay(this.focusTrapId, this.overlayIdPrefix, FocusTrapTracker.getTrapIds());
    const newLayered = this.focusTrap.active && isNested;

    if (oldLayered !== newLayered) {
      this.isLayered = newLayered;
      this.requestUpdate('isLayered', oldLayered);
    }

    super.updated(props);
  }

  // TODO: MAKE CDS-MOTION A DECORATOR
  runAnimation(showOrHide: string) {
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
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.fireEventOnEscape);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.fireEventOnEscape);
    this.backdrop.removeEventListener('click', this.fireEventOnBackdropClick);
  }

  constructor() {
    super();

    // override focus-trap base id so we know this is an overlay
    this.focusTrapId = createId(this.overlayIdPrefix);
  }

  closeOverlay(trigger: CloseChangeSources = 'custom') {
    this.closeChange.emit(trigger);
  }

  protected get backdropTemplate() {
    return html`<div
      class="${this.isLayered ? 'overlay-backdrop layered' : 'overlay-backdrop'}"
      aria-hidden="true"
    ></div>`;
  }

  protected render() {
    return html`
      ${this.backdropTemplate}
      <div class="private-host" tabindex="-1" aria-modal="true" role="dialog">
        <slot></slot>
      </div>
    `;
  }

  get overlayIsActive() {
    return FocusTrapTracker.getCurrentTrapId() === this.focusTrapId;
  }

  protected fireEventOnBackdropClick = () => {
    if (overlayIsActive(this.focusTrapId)) {
      this.closeOverlay('backdrop-click');
    }
  };

  protected fireEventOnEscape = (e: KeyboardEvent) => {
    if (overlayIsActive(this.focusTrapId)) {
      onKey('escape', e, () => {
        this.closeOverlay('escape-keypress');
      });
    }
  };

  static get styles() {
    return [baseStyles, styles];
  }
}
