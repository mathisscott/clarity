/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons, checkCircleIcon } from '@cds/core/icon';

ClarityIcons.addIcons(checkCircleIcon);
/**
 * Describe eslint rules here! (Write once use everywhere)
 */
const eslintRules: Record<string, { name: string; errorLevel: string; fixer: boolean }> = {
  'no-clr-accordion': { name: 'Accordion', errorLevel: 'warn', fixer: false },
  'no-clr-alert': { name: 'Alert', errorLevel: 'warn', fixer: false },
  'no-clr-badge': { name: 'Badge', errorLevel: 'warn', fixer: true },
  'no-clr-button': { name: 'Button', errorLevel: 'warn', fixer: false },
  'no-clr-checkbox': { name: 'Checkbox', errorLevel: 'warn', fixer: false },
  'no-clr-datalist': { name: 'Datalist', errorLevel: 'warn', fixer: false },
  'no-clr-form': { name: 'Form', errorLevel: 'warn', fixer: false },
  'no-clr-icon': { name: 'Icon', errorLevel: 'warn', fixer: true },
  'no-clr-input': { name: 'Input', errorLevel: 'warn', fixer: false },
  'no-clr-label': { name: 'Label', errorLevel: 'warn', fixer: true },
  'no-clr-list': { name: 'List', errorLevel: 'warn', fixer: true },
  'no-clr-modal': { name: 'Modal', errorLevel: 'warn', fixer: false },
  'no-clr-password': { name: 'Password', errorLevel: 'warn', fixer: false },
  'no-clr-radio': { name: 'Radio', errorLevel: 'warn', fixer: false },
  'no-clr-range': { name: 'Range', errorLevel: 'warn', fixer: false },
  'no-clr-select': { name: 'Select', errorLevel: 'warn', fixer: false },
  'no-clr-textarea': { name: 'Textarea', errorLevel: 'warn', fixer: false },
  'no-clr-toggle': { name: 'Toggle', errorLevel: 'warn', fixer: false },
};

@Component({
  template: `
    <h1>Adoption tooling</h1>

    <h3>Clarity Adoption ESLint plugin</h3>
    <p>
      The
      <a href="https://www.npmjs.com/package/@clr/eslint-plugin-clarity-adoption">Clarity Adoption ESLint plugin</a>
      helps with the adoption of Clarity Core components. The plugin provides ESLint rules to detect and warn against
      the usage of Clarity Angular components. A few rules also have fixers that replace the Clarity Angular components
      with their Clarity Core alternatives. You can enable rules with project configuration. For example, you can start
      with a configuration listing only the <i>no-clr-badge</i> rule to warn against the usage of badges and gradually,
      add more rules.
    </p>

    <h4>Installation</h4>
    <p>
      The plugin is distributed as npm package -
      <a href="https://www.npmjs.com/package/@clr/eslint-plugin-clarity-adoption">@clr/eslint-plugin-clarity-adoption</a
      >. To start using it, add the following dependencies to your project.
    </p>
    <sourcecode [content]="eslintInstallation" language="bash"></sourcecode>

    <h4>Configuration</h4>
    <p>
      Create an ESLint configuration file named <code>.eslintrc.json</code> in the root directory of your project. Add
      the following content.
      <sourcecode [content]="eslintConfiguration" language="json"></sourcecode>
    </p>
    <p>
      The configuration above enables all rules distributed with the Clarity Adoption plugin. To turn off a rule, remove
      it from the rules list. The plugin uses <b>@clr/eslint-plugin-clarity-adoption/html-parser</b> to lint HTML files
      and <b>@typescript-eslint/parser</b> to lint inlined Angular component templates.
    </p>

    <p>Finally, you'll need to run eslint with the <code>--ext</code> flag to enable HTML scanning.</p>
    <sourcecode [content]="eslintCommand" language="bash"></sourcecode>

    <p>You can tell ESLint to fix any detected problems with the <code>--fix</code> option.</p>
    <sourcecode [content]="eslintFixCommand" language="bash"></sourcecode>

    <h4>Rules</h4>

    <table class="table">
      <caption>
        Rules distributed with the Clarity Adoption ESLint plugin.
      </caption>
      <thead>
        <tr>
          <th>Clarity component</th>
          <th>ESLint rule name</th>
          <th>Default error level</th>
          <th>Provide fixer</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let rule of eslintRules | keyvalue">
          <td class="left">{{ rule.value.name }}</td>
          <td class="left">
            <code>@clr/clarity-adoption/{{ rule.key }}</code>
          </td>
          <td>{{ rule.value.errorLevel }}</td>
          <td><cds-icon size="md" status="success" shape="check-circle" solid *ngIf="rule.value.fixer"></cds-icon></td>
        </tr>
      </tbody>
    </table>
  `,
})
export class AdoptionToolingPage {
  eslintRules = eslintRules;

  eslintInstallation = `
npm install --save-dev @clr/eslint-plugin-clarity-adoption @typescript-eslint/parser eslint
`;

  eslintConfiguration = `
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2015
  },
  "plugins": ["@clr/clarity-adoption"],
  "rules": {
${Object.keys(eslintRules)
  .map((rule: string) => {
    return `    "@clr/clarity-adoption/${rule}": "${(eslintRules[rule] || {}).errorLevel}"`;
  })
  .join(',\n')}
  },
  "overrides": [
    {
      "files": ["*.html"],
      "parser": "@clr/eslint-plugin-clarity-adoption/html-parser"
    }
  ]
}
`;

  eslintCommand = `npx eslint --ext=ts,html src/`;
  eslintFixCommand = `npx eslint --ext=ts,html --fix src/`;
}
