import { customElement } from 'lit-element';
import { ClarityIcons } from '@cds/core/icon/icon.service.js';
import { angleIcon } from '@cds/core/icon/shapes/angle.js';
import { CdaNavGroup } from './nav-group.element.js';
import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';

ClarityIcons.addIcons(angleIcon);

@customElement('cda-nav-group')
class CdaNavGroupRegistration extends CdaNavGroup {} // eslint-disable-line

declare global {
  interface HTMLElementTagNameMap {
    'cda-nav-group': CdaNavGroup;
  }
}
