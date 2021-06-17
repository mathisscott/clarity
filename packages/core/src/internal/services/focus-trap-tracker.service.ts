/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { setAttributes } from '../utils/dom.js';
import { arrayTail } from '../utils/array.js';
import { GlobalState } from './global.service.js';

/**
 * FocusTrapTracker is a static class that keeps track of the active element with focus trap,
 * in case there are multiple in a given page.
 */

export const CDS_FOCUS_TRAP_ID_ATTR = 'focus-trap-id';
export const FOCUS_TRAP_ACTIVE_ATTR = '_focus-trap-active';
export const FOCUS_TRAP_GLOBAL_KEY = 'focusTraps';

// TODO: ###LEFTOFF -- REFACTOR TO USE THE GLOBAL CDS SERVICE INSTEAD OF BODY ATTR

let docRoot: HTMLElement;

export class FocusTrapTracker {
  static get docroot(): HTMLElement {
    if (!docRoot) {
      docRoot = document.querySelector('html');
    }
    return docRoot;
  }

  static get trapIds(): string[] {
    return GlobalState.getValue(FOCUS_TRAP_GLOBAL_KEY);
  }

  static set trapIds(ids: string[]) {
    const hasIds = ids.length > 0 ? '' : false;
    // both sets and removes scroll-blocking attr if there are or aren't any focus traps
    setAttributes(this.docroot, [FOCUS_TRAP_ACTIVE_ATTR, hasIds]);
    GlobalState.setValue(FOCUS_TRAP_GLOBAL_KEY, ids);
  }

  static set activeTrapId(myId: string) {
    if (myId === '') {
      return;
    }

    const trapIds = Array.from(this.trapIds);

    // this is a just-in-case situation. we should never encounter it.
    // but in the event that we do, this guard will ensure no id is in the
    // focus trap list more than once.
    if (arrayTail(trapIds) === myId) {
      return;
    }

    const existingIndex = trapIds.indexOf(myId);
    if (existingIndex > -1) {
      trapIds.splice(existingIndex, 1);
    }

    trapIds.push(myId);
    this.trapIds = trapIds;
  }

  static get activeTrapId(): string {
    return arrayTail(this.trapIds) || '';
  }

  static getActiveTrapElement(): HTMLElement | null {
    const root = this.docroot;
    const currentId = this.activeTrapId;

    if (currentId !== '') {
      return root.querySelector(`[${CDS_FOCUS_TRAP_ID_ATTR}="${currentId}"]`);
    } else {
      return null;
    }
  }

  static activatePreviousTrap(): void {
    const trapIds = Array.from(this.trapIds);
    trapIds.pop();
    this.trapIds = trapIds;
  }

  // TODO: DELETE IF GETTERS/SETTERS DON'T WORK OUT
  // static getTrapIds(): string[] {
  //   return GlobalState.getValue(FOCUS_TRAP_GLOBAL_KEY);
  // }

  // static setTrapIds(trapIds: string[]): void {
  //   const hasIds = trapIds.length > 0 ? '' : false;
  //   GlobalState.setValue(FOCUS_TRAP_GLOBAL_KEY, trapIds);
  //   // both sets and removes scroll-blocking attr if there are or aren't any focus traps
  //   setAttributes(this.docroot, [FOCUS_TRAP_ACTIVE_ATTR, hasIds]);
  // }

  // static setCurrent(myTrapId: string): void {
  //   if (myTrapId === '') {
  //     return;
  //   }

  //   const trapIds = Array.from(this.getTrapIds());

  //   // this is a just-in-case situation. we should never encounter it.
  //   // but in the event that we do, this guard will ensure no id is in the
  //   // focus trap list more than once.
  //   if (arrayTail(trapIds) === myTrapId) {
  //     return;
  //   }

  //   const existingIndex = trapIds.indexOf(myTrapId);
  //   if (existingIndex > -1) {
  //     trapIds.splice(existingIndex, 1);
  //   }

  //   trapIds.push(myTrapId);
  //   this.setTrapIds(trapIds);
  // }

  // static getCurrentTrapId(): string {
  //   return arrayTail(this.getTrapIds()) || '';
  // }

  // static getCurrent(): HTMLElement | null {
  //   const docbody = this.getDocRoot();
  //   const currentId = this.getCurrentTrapId();

  //   if (currentId !== '') {
  //     return docbody.querySelector(`[${CDS_FOCUS_TRAP_ID_ATTR}="${currentId}"]`);
  //   } else {
  //     return null;
  //   }
  // }
}
