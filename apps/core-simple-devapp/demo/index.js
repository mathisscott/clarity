import '../dist/src/counter/register.js';
import '../dist/src/nav/register.js';
import '../dist/src/nav-group/register.js';
import '../dist/src/nav-item/register.js';

// const counter = document.querySelector('cda-counter');
// const currentCount = document.querySelector('#current-count');

// counter.addEventListener('increment', () => updateCount(counter.value + 1));
// counter.addEventListener('decrement', () => updateCount(counter.value - 1));

// updateCount(0);

// function updateCount(value) {
//   counter.value = value;
//   currentCount.textContent = value;
// }

const nav = document.getElementById('myNav');

nav.addEventListener('expand', e => {
  nav.expanded = true;
});
nav.addEventListener('collapse', e => {
  nav.expanded = false;
});

nav.addEventListener('groupexpand', e => {
  e.detail.expanded = 'true';
});

nav.addEventListener('groupcollapse', e => {
  e.detail.expanded = 'false';
});
