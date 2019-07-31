/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { cssVars, variableStore } from './css-vars-ponyfill-fork.esm.js';

export function runCssVarsPolyfill(config?: any): void {
  if (typeof window !== 'undefined') {
    (window as any).cssVars = cssVars;
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
        (window as any).ShadyCSS.styleDocument(variableStore.dom);
      },
    };
  }

  cssVars(config);
}

export { variableStore } from './css-vars-ponyfill-fork.esm.js';
