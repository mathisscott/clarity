import { __decorate } from "tslib";
import { customElement } from 'lit-element';
import { ClarityIcons } from '@cds/core/icon/icon.service.js';
import { angleIcon } from '@cds/core/icon/shapes/angle.js';
import { CdaNavGroup } from './nav-group.element.js';
import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';
ClarityIcons.addIcons(angleIcon);
let CdaNavGroupRegistration = class CdaNavGroupRegistration extends CdaNavGroup {
}; // eslint-disable-line
CdaNavGroupRegistration = __decorate([
    customElement('cda-nav-group')
], CdaNavGroupRegistration);
//# sourceMappingURL=register.js.map