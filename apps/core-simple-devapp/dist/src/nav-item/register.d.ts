import { CdaNavItem } from './nav-item.element.js';
import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cda-nav-item': CdaNavItem;
    }
}
