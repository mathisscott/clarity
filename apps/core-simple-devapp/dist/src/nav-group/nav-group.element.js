import { __decorate } from "tslib";
import { html, LitElement, property } from 'lit-element';
import { styles } from './nav-group.element.styles.js';
/**
 * @internal
 * Base styles are currently an internal API not subject to semver updates.
 *
 * The base styles provide styles for core components that use shadow DOM.
 * Components using the base styles are required to have the global clarity
 * core styles loaded in the window.
 */
import { baseStyles, createId, internalProperty, querySlotAll, queryChildFromLightOrShadowDom } from '@cds/core/internal';
export class CdaNavGroup extends LitElement {
    constructor() {
        super();
        this._parentGroup = null;
        this.expanded = 'false';
        this.ariaHidden = 'false';
        this._navGroupBtnId = '_navGroupBtn-' + createId();
    }
    static get styles() {
        return [baseStyles, styles];
    }
    get isExpanded() {
        return this.expanded === 'true';
    }
    get navGroupBtn() {
        return queryChildFromLightOrShadowDom(this, '#' + this._navGroupBtnId);
    }
    updated(props) {
        super.updated(props);
        if (props.has('expanded')) {
            this.childItems.forEach((i) => {
                const item = i;
                item.ariaHidden = this.expanded === 'true' ? 'false' : 'true';
                if (!item._parentGroup) {
                    item._parentGroup = this;
                }
            });
        }
        if (props.has('ariaHidden')) {
            if (this.ariaHidden === 'true') {
                this.childItems.forEach((i) => {
                    const item = i;
                    item.ariaHidden = 'true';
                });
            }
            else if (this.ariaHidden === 'false') {
                this.childItems.forEach((i) => {
                    const item = i;
                    item.ariaHidden = this.expanded === 'true' ? 'false' : 'true';
                    if (!item._parentGroup) {
                        item._parentGroup = this;
                    }
                });
            }
        }
    }
    render() {
        return html `
      <div class="private-host" cds-layout="vertical gap:sm">
        <cds-button id="${this._navGroupBtnId}" class="navgroup-btn" block status="neutral" action="${this.ariaHidden === 'true' ? 'outline' : 'solid'}"
        @click=${this.toggle}
        >
          <slot name="title"></slot>
          <cds-icon shape="angle" direction="${this.isExpanded ? 'down' : 'right'}"></cds-icon>
        </cds-button>
        <div cds-layout="p-x:lg vertical gap:sm">
          <slot></slot>
        </div>
      </div>
    `;
    }
    toggle() {
        this.emit(this.isExpanded ? 'groupcollapse' : 'groupexpand');
    }
    emit(value) {
        this.dispatchEvent(new CustomEvent(value, { detail: this, bubbles: true }));
    }
}
__decorate([
    property({ type: String, attribute: 'aria-expanded', reflect: true })
], CdaNavGroup.prototype, "expanded", void 0);
__decorate([
    internalProperty({ type: String, attribute: 'aria-hidden', reflect: true })
], CdaNavGroup.prototype, "ariaHidden", void 0);
__decorate([
    querySlotAll(':scope > :not([slot="title"]')
], CdaNavGroup.prototype, "childItems", void 0);
//# sourceMappingURL=nav-group.element.js.map