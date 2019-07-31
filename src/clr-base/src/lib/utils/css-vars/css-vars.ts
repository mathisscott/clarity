/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import IWindow from '../../interfaces/window.interface';
import { cssVars, variableStore } from './css-vars-ponyfill-fork.esm.js';

declare var window: IWindow;

function hasCssVars(win: IWindow): boolean {
  return win.hasOwnProperty('cssVars');
}

// exporting so we can test it
export function cssVarsPolyfillHasRun(win: IWindow): boolean {
  const defaultPolyfillObject = { polyfills: { cssVarsHasRun: false } };

  // TODO: needs a new name
  if (!win.hasOwnProperty('__ClarityInternals')) {
    win.__ClarityInternals = { ...defaultPolyfillObject };
    return false;
  } else if (!win.__ClarityInternals.hasOwnProperty('polyfills')) {
    Object.assign(win.__ClarityInternals, { ...defaultPolyfillObject });
    return false;
  } else if (typeof win.__ClarityInternals.polyfills.cssVarsHasRun === 'undefined') {
    win.__ClarityInternals.polyfills.cssVarsHasRun = false;
    return false;
  } else {
    return !!win.__ClarityInternals.polyfills.cssVarsHasRun;
  }
}

export function runCssVarsPolyfill(config?: any): void {
  const runCssVarsPolyfillStart = new Date();
  if (typeof window !== 'undefined' && hasCssVars(window)) {
    window.cssVars = cssVars;
  }

  if (typeof config === 'undefined') {
    // initial load 9-10 seconds
    // switching them ~30 seconds
    // toggling themes increased cssVars load time by about 9 seconds each theme switch
    config = {
      onlyLegacy: true,
      // shadowDOM: true, // shaved off no time on initial load but 7-8 seconds on theme switch
      // watch: true, // turning off watch altogether saved no time on initial load but reduced theme switching to 5 seconds; additionally, this function has to be called for every theme switch
      updateURLs: false,
      // preserveStatic: false, // makes things < 300 ms in IE but leaving off for concerns re: custom property limitations
      updateDOM: true, // has to stay true
      // preserveVars: true, // shaved off 1.5 seconds on initial load, ~9 seconds on theme switch
      // onBeforeSend: function() {
      //   console.log('css vars on before send');
      // },
      // onSuccess: function() {
      //   console.log('css vars on success');
      // },
      onComplete: function(cssText) {
        // window.__ClarityInternals.polyfills.cssVarsHasRun = true;
        // console.log('css vars ran with default config - on complete');
        // console.log(variableStore.dom);
        const runCssVarsPolyfillEnd = new Date();
        let shadyCssStyleDocumentEnd: Date;
        console.log(
          'cssVars took ',
          runCssVarsPolyfillEnd.valueOf() - runCssVarsPolyfillStart.valueOf(),
          ' milliseconds'
        );
        (window as any).ShadyCSS.styleDocument(variableStore.dom);
        shadyCssStyleDocumentEnd = new Date();
        console.log(
          'shadyCssStyleDocument in cssVars onComplete took ',
          shadyCssStyleDocumentEnd.valueOf() - runCssVarsPolyfillEnd.valueOf(),
          ' milliseconds'
        );
      },
    };
  }

  // if (!cssVarsPolyfillHasRun(window)) {
  //   cssVars(config);
  // }
  cssVars(config);
}

export { variableStore } from './css-vars-ponyfill-fork.esm.js';
