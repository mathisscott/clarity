/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { APP_ROUTES } from './app.routing';

// 2019-07-17: trying this in the app.component per
// https://stackoverflow.com/questions/55576987/working-with-var-css-in-internet-explorer-using-angular-7/55610449#55610449
import { runCssVarsPolyfill } from '@clr/base/src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public routes: Route[] = APP_ROUTES;

  ngOnInit() {
    runCssVarsPolyfill();
  }
}
