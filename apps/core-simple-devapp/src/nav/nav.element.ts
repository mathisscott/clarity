import { html, LitElement, query } from 'lit-element';
import { styles } from './nav.element.styles.js';

/**
 * @internal
 * Base styles are currently an internal API not subject to semver updates.
 *
 * The base styles provide styles for core components that use shadow DOM.
 * Components using the base styles are required to have the global clarity
 * core styles loaded in the window.
 */
import { baseStyles, onAnyKey, property, querySlotAll, stopEvent } from '@cds/core/internal';
import { CdaNavGroup } from '../nav-group/nav-group.element.js';
import { CdsButton } from '@cds/core/button';
import { CdaNavItem } from '../nav-item/nav-item.element.js';

export class CdaNav extends LitElement {
  static get styles() {
    return [baseStyles, styles];
  }

  @query('.nav-title')
  navTopButton: any;

  @querySlotAll('cda-nav-group:not([aria-hidden="true"]), cda-nav-item:not([aria-hidden="true"])')
  navigableItems: any;

  firstUpdated(props: Map<string, any>) {
    super.firstUpdated(props);

    this.setupKeyboardNavigation();
  }

  disconnectedCallback() {
    this.tearDownKeyboardNavigation();
  }

  @property({ type: Boolean }) expanded = true;

  render() {
    return html`
      <div cds-layout="vertical gap:sm p-b:lg">
        <cds-button
          class="nav-title"
          action="${this.expanded ? 'solid' : 'outline'}"
          block
          style="display:block"
          @click=${this.toggle}
        >
          <span style="${this.expanded ? 'display: inline-block' : 'display: none'}"><slot name="title"></slot></span>
          <cds-icon shape="angle" direction="${this.expanded ? 'left' : 'right'}"></cds-icon>
        </cds-button>
        <div class="nav" cds-layout="p-x:lg align:left vertical gap:sm">
          <slot @slotchange=${this.setUpChildren}></slot>
        </div>
      </div>
    `;
  }

  private setUpChildren() {
    for (let i = 0; i < this.children.length; i++) {
      const item = this.children[i];
      const itemType = this.findFocusedItemType(item);
      if (
        (itemType === 'cda-nav-item' || itemType === 'cda-nav-group') &&
        (item as CdaNavGroup | CdaNavItem)._parentGroup === null
      ) {
        (item as CdaNavGroup | CdaNavItem)._parentGroup = this;
      }
    }
  }

  private toggle() {
    this.emit(this.expanded ? 'collapse' : 'expand');
  }

  private emit(value: string) {
    this.dispatchEvent(new CustomEvent(value));
  }

  private setupKeyboardNavigation() {
    this.addEventListener('keydown', this.handleKeyEvents);
  }

  private tearDownKeyboardNavigation() {
    this.removeEventListener('keydown', this.handleKeyEvents);
  }

  get currentFocused() {
    return document.activeElement;
  }

  get currentFocusedType() {
    return this.findFocusedItemType(this.currentFocused);
  }

  findFocusedItemType(item: Element | null) {
    if (item === this || item === this.navTopButton) {
      return 'cda-nav';
    }

    if (item?.tagName.toLowerCase() === 'cda-nav-group' || item?.classList.contains('navgroup-btn')) {
      return 'cda-nav-group';
    }

    if (item?.tagName.toLowerCase() === 'cda-nav-item') {
      return 'cda-nav-item';
    }

    return '';
  }

  get currentFocusedIndex(): number {
    const nowFocused = this.currentFocused;
    if (nowFocused === this || nowFocused === this.navTopButton) {
      return -1;
    }

    for (var i = 0; i < this.navigableItems.length; i++) {
      const myItem = this.navigableItems[i];

      if (myItem === nowFocused) {
        return i;
      }

      if (myItem.tagName.toLowerCase() === 'cda-nav-group' && nowFocused === (myItem as CdaNavGroup).navGroupBtn) {
        return i;
      }
    }

    return -1;
  }

  private handleKeyEvents(evt: KeyboardEvent) {
    onAnyKey(['arrow-left'], evt, () => {
      console.log('left');
      const typeOfFocused = this.currentFocusedType;

      if (typeOfFocused === 'cda-nav' && this.expanded === true) {
        this.toggle();
      } else if (
        typeOfFocused === 'cda-nav-group' &&
        (this.navigableItems[this.currentFocusedIndex] as CdaNavGroup).expanded === 'false'
      ) {
        const parent = (this.navigableItems[this.currentFocusedIndex] as CdaNavGroup)._parentGroup;
        const typeOfParent = this.findFocusedItemType(parent);

        if (typeOfParent === 'cda-nav') {
          (parent as CdaNav).navTopButton.focus();
        } else if (typeOfParent === 'cda-nav-group') {
          ((parent as CdaNavGroup).navGroupBtn as CdsButton)?.focus();
        }
      } else if (typeOfFocused === 'cda-nav-item') {
        const parent = (this.navigableItems[this.currentFocusedIndex] as CdaNavItem)._parentGroup;
        const typeOfParent = this.findFocusedItemType(parent);

        if (typeOfParent === 'cda-nav') {
          (parent as CdaNav).navTopButton.focus();
        } else if (typeOfParent === 'cda-nav-group') {
          ((parent as CdaNavGroup).navGroupBtn as CdsButton)?.focus();
        }
      } else if (typeOfFocused === 'cda-nav-group') {
        const whatIsFocused = this.navigableItems[this.currentFocusedIndex] as CdaNavGroup;
        if (whatIsFocused.expanded === 'true') {
          whatIsFocused.toggle();
        }
      }

      stopEvent(evt);
    });

    onAnyKey(['arrow-right'], evt, () => {
      console.log('right');
      const typeOfFocused = this.currentFocusedType;

      if (typeOfFocused === 'cda-nav' && this.expanded === false) {
        this.toggle();
      } else if (typeOfFocused === 'cda-nav-group') {
        const whatIsFocused = this.navigableItems[this.currentFocusedIndex] as CdaNavGroup;
        if (whatIsFocused.expanded === 'false') {
          whatIsFocused.toggle();
        }
      }

      stopEvent(evt);
    });

    onAnyKey(['arrow-up'], evt, () => {
      console.log('up');
      const currentIndex = this.currentFocusedIndex;

      if (currentIndex === 0) {
        this.navTopButton.focus();
      } else {
        const prevIndex = currentIndex - 1;
        const itemToFocus = this.navigableItems[prevIndex];
        const whatToFocus = this.findFocusedItemType(itemToFocus);

        if (!whatToFocus) {
          return;
        } else if (whatToFocus === 'cda-nav-group') {
          ((itemToFocus as CdaNavGroup)?.navGroupBtn as CdsButton)?.focus();
        } else if (whatToFocus === 'cda-nav-item') {
          itemToFocus.focus();
        }
      }

      stopEvent(evt);
    });

    onAnyKey(['arrow-down'], evt, () => {
      console.log('down');

      const currentIndex = this.currentFocusedIndex;

      if (currentIndex === this.navigableItems.length - 1) {
        return;
      } else {
        const nextIndex = currentIndex + 1;
        const itemToFocus = this.navigableItems[nextIndex];
        const whatToFocus = this.findFocusedItemType(itemToFocus);

        if (!whatToFocus) {
          return;
        } else if (whatToFocus === 'cda-nav-group') {
          ((itemToFocus as CdaNavGroup)?.navGroupBtn as CdsButton)?.focus();
        } else if (whatToFocus === 'cda-nav-item') {
          itemToFocus.focus();
        }
      }

      stopEvent(evt);
    });

    onAnyKey(['home'], evt, () => {
      console.log('home');

      this.navTopButton.focus();

      stopEvent(evt);
    });

    onAnyKey(['end'], evt, () => {
      console.log('end');

      const itemToFocus = this.navigableItems[this.navigableItems.length - 1];
      const whatToFocus = this.findFocusedItemType(itemToFocus);

      if (!whatToFocus) {
        return;
      } else if (whatToFocus === 'cda-nav-group') {
        ((itemToFocus as CdaNavGroup)?.navGroupBtn as CdsButton)?.focus();
      } else if (whatToFocus === 'cda-nav-item') {
        itemToFocus.focus();
      }

      stopEvent(evt);
    });
  }
}
