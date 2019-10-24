/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerElementSafely } from '@clr/core/common';
import { html, LitElement, property } from 'lit-element';
import { identity, ifElse } from 'ramda';

import { styles } from './button.element.css';

// can be re-used
function getHostWidth(host: HTMLElement, unit = 'px') {
  // additional tests can be added if we need more checks
  return host.getBoundingClientRect ? host.getBoundingClientRect().width + unit : '';
}

// extends getHostWidth; can be reused and also tested in isolation
function getHostWidthUnless(host: HTMLElement, unless: boolean) {
  if (!unless) {
    return getHostWidth(host);
  }
  return null;
}

// can be reused; if rendering bug is no longer needed can remove by early returning
// if rendering bug needs to be changed; can be changed here and everywhere it is needed
// will change with it
function getTranslateForChromeRenderingBugUnless(unless: boolean) {
  const translateFix = 'translateZ(0px)';
  if (!unless) {
    return translateFix;
  }
  return null;
}

// can be reused;
function toggleDisabledAttribute(el: HTMLElement, doToggle: boolean) {
  if (doToggle) {
    el.removeAttribute('disabled');
  } else {
    el.setAttribute('disabled', '');
  }
}

// @dynamic
export class CwcButton extends LitElement {
  @property() state = 'default';

  @property() disabled = false;

  static get styles() {
    return styles;
  }

  render() {
    return html`<div>Button Placeholder</div>`;
  }

  loadingStateChange(state: string): void {
    if (state === this.state) {
      return;
    }

    if (state === 'error') {
      this.loadingStateChange('default');
    } else {
      // if default state is updated or add'l states circumvent; can be added here
      const stateIsDefault = state === 'default';
      this.state = state;
      // passing 'this' may seem weird here but function is only accessing the DOM API
      this.style.width = getHostWidthUnless(this, stateIsDefault);
      this.style.transform = getTranslateForChromeRenderingBugUnless(stateIsDefault);
      // passing 'this' may seem weird here but function is only accessing the DOM API
      toggleDisabledAttribute(this, stateIsDefault && !this.disabled);
    }

    /*
      10 LOC vs. 23 LOC
      1 fn that can be reused immediately (toggleDisabled)
      1 fn that has high likelihood of reuse (chrome rendering bug)
      1 sneaky bug with success state that should not have been there (success relied on loading state to happen before it; granted it's a likely scenario but still it's fertile ground for a future bug)
      for testing, reduced reliance on the loadingStateChange unit tests; also easier to mock if you wanted to

      as far as functional goes, the code is... okay... but we're not going for 100% functional.
      we're trying to use the pieces of functional programming that make our code easier to reuse and maintain.
    */

    // middle point...
    // if (state === this.state) {
    //   return;
    // } else if (state === 'error') {
    //   this.loadingStateChange("default");
    // } else {
    //   this.state = state;
    //   this.style.width = (state === 'default') ? null : this.getBoundingClientRect().width + 'px';
    //   this.style.transform = (state === 'default') ? null : 'translatez(0)';
    //   if (state === 'default' && !this.disabled) {
    //     this.removeAttribute('disabled');
    //   } else {
    //     this.setAttribute('disabled', '');
    //   }
    // }

    // switch (state) {
    //   case "default":
    //     this.style.width = null;
    //     this.style.transform = null;
    //     // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
    //     if (!this.disabled) {
    //       this.removeAttribute('disabled'); <= removing and setting disabled seems very common
    //     }
    //     break;
    //   case "loading":
    //     this.setExplicitButtonWidth(); <= if this function call needs to change will you remember both places?
    //     this.style.transform = 'translatez(0)'; <= if this is needed elsewhere, do we copy paste it?
    //     // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
    //     this.setAttribute('disabled', '');
    //     break;
    //   case "success": <= if the success state is ever invoked before loading (or without it), there will be a visual
    //                      bug
    //     this.setExplicitButtonWidth(); <= if this function call needs to change will you remember both places?
    //     break;
    //   case "error":
    //     this.loadingStateChange("default");
    //     break;
    //   default:
    //     break;
    // }
    // this.clrLoadingChange.emit(state);
  }

  private setExplicitButtonWidth() {
    if (this.getBoundingClientRect) {
      this.style.width = this.getBoundingClientRect().width + 'px';
    }
  }
}

registerElementSafely('cwc-button', CwcButton);
