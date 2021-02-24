import { ClarityIcons, angleIcon } from '@cds/core/icon';
import '@cds/core/badge/register.js';
import '@cds/core/button/register.js';
import '@cds/core/accordion/register.js';
import '@cds/core/modal/register.js';
import '@cds/core/icon/register.js';
import './index.css';

ClarityIcons.addIcons(angleIcon);
document.querySelector('cds-badge').innerText = window.CDS.getVersion().versions[0];
