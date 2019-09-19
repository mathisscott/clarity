/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { ClarityIcons, userIcon } from '@clr/core';
import '@clr/core/test-dropdown';

ClarityIcons.addIcon(['user', userIcon]);

@Component({
  selector: 'app-dropdown-demo',
  templateUrl: './dropdown.demo.html',
})
export class DropdownDemoComponent {
  open = false;
}
