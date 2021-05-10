import { __decorate } from "tslib";
import { property } from 'lit-element';
/**
 * @internal
 * Base styles are currently an internal API not subject to semver updates.
 *
 * The base styles provide styles for core components that use shadow DOM.
 * Components using the base styles are required to have the global clarity
 * core styles loaded in the window.
 */
import { CdsButton } from '@cds/core/button';
export class CdaNavItem extends CdsButton {
    constructor() {
        super();
        this.ariaHidden = 'false';
        this._parentGroup = null;
        this.action = "outline";
        this.status = "neutral";
        this.block = true;
        this.style.textAlign = "left";
        this.style.display = "block";
    }
    updated(props) {
        super.updated(props);
        if (props.has('ariaHidden')) {
            this.action = this.ariaHidden === 'true' ? 'outline' : 'solid';
        }
    }
}
__decorate([
    property({ type: String, attribute: 'aria-hidden', reflect: true })
], CdaNavItem.prototype, "ariaHidden", void 0);
//# sourceMappingURL=nav-item.element.js.map