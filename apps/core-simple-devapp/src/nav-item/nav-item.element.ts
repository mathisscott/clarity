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
import { CdaNav } from '../nav/nav.element.js';
import { CdaNavGroup } from '../nav-group/nav-group.element.js';

export class CdaNavItem extends CdsButton {
  @property({ type: String, attribute: 'aria-hidden', reflect: true }) ariaHidden: 'true' | 'false' | null = 'false';

  _parentGroup: CdaNavGroup | CdaNav | null = null;

  constructor() {
    super();
    this.action = 'outline';
    this.status = 'neutral';
    this.block = true;
    this.style.textAlign = 'left';
    this.style.display = 'block';
  }

  updated(props: Map<string, any>) {
    super.updated(props);

    if (props.has('ariaHidden')) {
      this.action = this.ariaHidden === 'true' ? 'outline' : 'solid';
    }
  }
}
