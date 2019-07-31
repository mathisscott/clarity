/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { runCssVarsPolyfill } from './css-vars';
import IWindow from '../../interfaces/window.interface';

declare var window: IWindow;

describe('CssVarsPolyfill', () => {
  xdescribe('runCssVarsPolyfill', () => {
    // need different tests here...
    // beforeEach(function() {
    //   counter = 0;
    //   window.cssVars = function() {
    //     counter++;
    //   };
    // });
    // let counter = 0;
  });
});
