/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// V these polyfills were missing for some reason. i probably deleted them like an idoit
/* IE9, IE10 and IE11 requires all of the following polyfills. */
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';

// https://stackoverflow.com/questions/54764616/problem-with-angular-element-support-in-chrome-and-ie11-simultaneously
// ...said to include this before the polyfills listed below.
import 'core-js/shim';

/* IE10 and IE11 requires the following for NgClass support on SVG elements */
// import "classlist.js"; // Run `npm install --save classlist.js`.

/* Evergreen browsers require these. */
import 'core-js/es6/reflect';

/* Polyfill for icons web components */

// V this polyfill fixed most of the problems
// this shim throws a syntax error because there is an arrow function () => {} in it...
// ¿ maybe there is an es5 compiled version?
// !!! this is the current issue i'm struggling with
// import '@webcomponents/custom-elements/src/native-shim.js';

// vv this polyfill breaks using HTMLelement as a constructor
// combined with custom-elements below gives me an "Object or property does not support attach shadow" in IE11
// ...but! the app builds in ie11. it doesn't navigate or anything tho
// we need this polyfill to make custom elements show up in Chrome on the devapp!
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';

// This was the recommended bundle but is causes the same "defineProperty"
// console error as the bundle up above (which makes sense, tbh)
// import '@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js';

// V this polyfill was no help. cannot find "defineProperty"
// import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';

// vv i added this polyfill back in;
// all alone it gives me an "Object or property does not support attach shadow" in IE11
// import '@webcomponents/custom-elements';
// import '@webcomponents/shadydom';
// import '@webcomponents/shadycss';

// this vvv was recommended but doesn't exist. maybe their dox are out of date?
// import '@webcomponents/webcomponentsjs/webcomponents-loader.js';

// according to... https://stackoverflow.com/questions/54764616/problem-with-angular-element-support-in-chrome-and-ie11-simultaneously
// these polyfills need to be in THIS order....
// import '@webcomponents/shadydom';
// import '@webcomponents/custom-elements/src/native-shim';
// import '@webcomponents/custom-elements';

// following Cory's attempt we landed here...
import '@webcomponents/shadydom';
import '@webcomponents/shadycss/scoping-shim.min.js';
// import '@webcomponents/shadycss/custom-style-interface.min.js';
import '@webcomponents/template';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/custom-elements';

// 2019-07-17: loading the ponyfill here passes "undefined" as the global object
// should we try loading this in scripts?! <= didn't work. same problem.
// import 'css-vars-ponyfill/dist/css-vars-ponyfill.js';

// 2019-07-17: trying to load as a module in the clr-base?!
// import 'css-vars-ponyfill/dist/css-vars-ponyfill.js';

/*
 * Required to support Web Animations `@angular/animation`.
 * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
 */
import 'web-animations-js'; // Run `npm install --save web-animations-js`.

/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js/dist/zone'; // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */

/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.
/**
 * Need to import at least one locale-data with intl.
 */
// import 'intl/locale-data/jsonp/en';
