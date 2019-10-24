/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CwcButton } from '@clr/core/button';
import '@clr/core/button';
import { componentIsStable, createTestElement, removeTestElement, waitForComponent } from '@clr/core/test/utils';

describe('button element', () => {
  let testElement: HTMLElement;
  let component: CwcButton;

  beforeEach(async () => {
    testElement = createTestElement();
    testElement.innerHTML = `<cwc-button></cwc-button>`;

    await waitForComponent('cwc-button');
    component = testElement.querySelector<CwcButton>('cwc-button');
  });

  afterEach(() => {
    removeTestElement(testElement);
  });

  it('should render button', async () => {
    await componentIsStable(component);
    expect(component.shadowRoot.innerHTML.includes('Button Placeholder')).toBe(true);
  });

  fdescribe('LoadingStateChange', () => {
    const expectedTransform = 'translateZ(0px)';

    it('should set default state as expected', async () => {
      await componentIsStable(component);
      component.state = 'blah';
      await componentIsStable(component);
      component.loadingStateChange('default');
      await componentIsStable(component);
      expect(component.style.width).toEqual('');
      expect(component.style.transform).toEqual('');
    });

    it('should set loading state as expected', async () => {
      await componentIsStable(component);
      const size = component.getBoundingClientRect().width + 'px';
      component.loadingStateChange('loading');
      await componentIsStable(component);
      expect(component.style.width).toEqual(size);
      expect(component.style.transform).toEqual(expectedTransform);
      expect(component.hasAttribute('disabled')).toEqual(true);
    });

    it('should set success state as expected', async () => {
      await componentIsStable(component);
      const size = component.getBoundingClientRect().width + 'px';
      component.loadingStateChange('success');
      await componentIsStable(component);
      expect(component.style.width).toEqual(size);
      expect(component.style.transform).toEqual(expectedTransform);
      expect(component.hasAttribute('disabled')).toEqual(true);
    });
  });
});
