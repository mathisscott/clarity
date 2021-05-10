/**
 * @internal
 * Base styles are currently an internal API not subject to semver updates.
 *
 * The base styles provide styles for core components that use shadow DOM.
 * Components using the base styles are required to have the global clarity
 * core styles loaded in the window.
 */
import { CdsButton } from '@cds/core/button';
import { CdaNav } from '../nav/nav.element.js';
import { CdaNavGroup } from '../nav-group/nav-group.element.js';
export declare class CdaNavItem extends CdsButton {
    ariaHidden: 'true' | 'false' | null;
    _parentGroup: CdaNavGroup | CdaNav | null;
    constructor();
    updated(props: Map<string, any>): void;
}
