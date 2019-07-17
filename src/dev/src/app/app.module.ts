/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from '@clr/angular';

import { AppComponent } from './app.component';
import { ROUTING } from './app.routing';
import { AppContentContainerComponent } from './content-container.component';
import { LandingComponent } from './landing.component';

// import { runCssVarsPolyfill } from '@clr/base';

// runCssVarsPolyfill();

@NgModule({
  declarations: [AppComponent, LandingComponent, AppContentContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [BrowserAnimationsModule, CommonModule, FormsModule, ReactiveFormsModule, ClarityModule, ROUTING],
  bootstrap: [AppComponent],
})
export class AppModule {}
