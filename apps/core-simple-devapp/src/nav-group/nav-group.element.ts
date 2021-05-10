import { html, LitElement, property, query } from 'lit-element';
import { styles } from './nav-group.element.styles.js';

/**
 * @internal
 * Base styles are currently an internal API not subject to semver updates.
 *
 * The base styles provide styles for core components that use shadow DOM.
 * Components using the base styles are required to have the global clarity
 * core styles loaded in the window.
 */
import {
  baseStyles,
  createId,
  internalProperty,
  querySlotAll,
  queryChildFromLightOrShadowDom,
} from '@cds/core/internal';
import { CdaNavItem } from '../nav-item/nav-item.element.js';
import { CdaNav } from '../nav/nav.element.js';

export class CdaNavGroup extends LitElement {
  static get styles() {
    return [baseStyles, styles];
  }

  _parentGroup: CdaNavGroup | CdaNav | null = null;

  @property({ type: String, attribute: 'aria-expanded', reflect: true }) expanded: 'true' | 'false' | null = 'false';

  @internalProperty({ type: String, attribute: 'aria-hidden', reflect: true }) ariaHidden: 'true' | 'false' | null =
    'false';

  private get isExpanded() {
    return this.expanded === 'true';
  }

  private _navGroupBtnId: string;

  constructor() {
    super();
    this._navGroupBtnId = '_navGroupBtn-' + createId();
  }

  get navGroupBtn() {
    return queryChildFromLightOrShadowDom(this, '#' + this._navGroupBtnId);
  }

  @querySlotAll(':scope > :not([slot="title"]')
  childItems: any;

  updated(props: Map<string, any>) {
    super.updated(props);

    if (props.has('expanded')) {
      this.childItems.forEach((i: HTMLElement) => {
        const item = i as CdaNavGroup | CdaNavItem;
        item.ariaHidden = this.expanded === 'true' ? 'false' : 'true';
        if (!item._parentGroup) {
          item._parentGroup = this;
        }
      });
    }

    if (props.has('ariaHidden')) {
      if (this.ariaHidden === 'true') {
        this.childItems.forEach((i: HTMLElement) => {
          const item = i as CdaNavGroup | CdaNavItem;
          item.ariaHidden = 'true';
        });
      } else if ((this.ariaHidden as string) === 'false') {
        this.childItems.forEach((i: HTMLElement) => {
          const item = i as CdaNavGroup | CdaNavItem;
          item.ariaHidden = this.expanded === 'true' ? 'false' : 'true';
          if (!item._parentGroup) {
            item._parentGroup = this;
          }
        });
      }
    }
  }

  render() {
    return html`
      <div class="private-host" cds-layout="vertical gap:sm">
        <cds-button
          id="${this._navGroupBtnId}"
          class="navgroup-btn"
          block
          status="neutral"
          action="${this.ariaHidden === 'true' ? 'outline' : 'solid'}"
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

  private emit(value: string) {
    this.dispatchEvent(new CustomEvent(value, { detail: this, bubbles: true }));
  }
}
