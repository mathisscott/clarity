/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { runCssVarsPolyfill } from '@clr/base/src/lib/utils/css-vars/css-vars';

declare global {
  interface Window {
    CSS: {
      supports: any;
    };
  }
}

// function doesBrowserSupportCustomProperties() {
//   return window.CSS && window.CSS.supports && window.CSS.supports('--go-niners', 0);
// }

const themes = {
  blue: {
    '--global-h1-color': 'blue',
    '--global-button-color': 'cornflowerblue',
    '--global-button-font-color': 'white',
  },
  default: {
    '--global-h1-color': 'magenta',
    '--global-button-color': 'red',
    '--global-button-font-color': 'white',
  },
  green: {
    '--global-h1-color': 'darkseagreen',
    '--global-button-color': 'seagreen',
    '--global-button-font-color': 'white',
  },
};

let counter = 0;

function switchTheme(theme: any): void {
  const shadyCssStyleDocumentStart = new Date();
  let shadyCssStyleDocumentEnd: Date;
  let switchThemeEnd: Date;
  // (window as any).ShadyCSS.styleDocument(theme);
  shadyCssStyleDocumentEnd = new Date();
  console.log(
    'shadyCssStyleDocument in switchTheme in landing component took ',
    shadyCssStyleDocumentStart.valueOf() - shadyCssStyleDocumentEnd.valueOf(),
    ' milliseconds'
  );

  const newStyle = document.createElement('style');
  document.head.appendChild(newStyle);
  newStyle.id = 'ie-theme_' + counter++;

  const myStyles = [':root { '];
  for (const item in theme) {
    if (theme.hasOwnProperty(item)) {
      myStyles.push(item);
      myStyles.push(': ');
      myStyles.push(theme[item]);
      myStyles.push('; ');
    }
  }
  myStyles.push('}');
  // console.log("myStyles = \n", myStyles.join(""));
  newStyle.innerHTML = myStyles.join('');

  switchThemeEnd = new Date();
  console.log(
    'The rest of switchTheme in landing component took ',
    shadyCssStyleDocumentEnd.valueOf() - switchThemeEnd.valueOf(),
    ' milliseconds'
  );
  runCssVarsPolyfill();
}

@Component({ templateUrl: './landing.html' })
export class LandingComponent {
  _theme = 'default';

  secondButtonShown = false;

  toggleSecondButton() {
    this.secondButtonShown = !this.secondButtonShown;
  }

  toggleTheme(): void {
    this._theme = this._theme !== 'blue' ? 'blue' : 'default';
    switchTheme(themes[this._theme]);
  }

  useGreenTheme(): void {
    this._theme = this._theme !== 'green' ? 'green' : 'default';
    switchTheme(themes[this._theme]);
  }

  resetTheme(): void {
    this._theme = 'default';
    switchTheme(themes[this._theme]);
  }
}
