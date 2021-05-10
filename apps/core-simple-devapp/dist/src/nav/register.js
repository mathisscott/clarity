import { __decorate } from "tslib";
import { customElement } from 'lit-element';
import { ClarityIcons } from '@cds/core/icon/icon.service.js';
import { angleIcon } from '@cds/core/icon/shapes/angle.js';
import { CdaNav } from './nav.element.js';
import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';
ClarityIcons.addIcons(angleIcon);
let CdaNavRegistration = class CdaNavRegistration extends CdaNav {
}; // eslint-disable-line
CdaNavRegistration = __decorate([
    customElement('cda-nav')
], CdaNavRegistration);
//# sourceMappingURL=register.js.map