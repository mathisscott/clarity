import { customElement } from 'lit-element';
import { CdaNavItem } from './nav-item.element.js';
import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';

@customElement('cda-nav-item')
class CdaNavItemRegistration extends CdaNavItem {} // eslint-disable-line

declare global {
  interface HTMLElementTagNameMap {
    'cda-nav-item': CdaNavItem;
  }
}
