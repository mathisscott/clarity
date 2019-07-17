/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';

const bodyEl: HTMLElement = document.getElementsByTagName('body')[0];
const cssVarList: string[] = ['--global-h1-color', '--global-button-color'];

function getCssVar(cssVarName: string, container: HTMLElement): string {
  return getComputedStyle(container).getPropertyValue(cssVarName);
}

function getNewColorStyle(oldColor: string): string {
  return oldColor === 'magenta' ? 'blue' : 'cornflowerblue';
}

@Component({ templateUrl: './landing.html' })
export class LandingComponent {
  toggleTheme(): void {
    this.resetTheme();
    cssVarList.forEach(cvar => {
      // note that we get extra spacing from the css property!
      bodyEl.style.setProperty(cvar, getNewColorStyle(getCssVar(cvar, bodyEl).trim()));
    });
  }

  logTheme(): void {
    cssVarList.forEach(cvar => {
      console.log(getCssVar(cvar, bodyEl));
    });
  }

  useGreenTheme(): void {
    this.resetTheme();
    bodyEl.classList.add('go-green');
  }

  resetTheme(): void {
    cssVarList.forEach(cvar => {
      bodyEl.style.setProperty(cvar, null);
      bodyEl.classList.remove('go-green');
    });
  }
}
