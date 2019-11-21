<div align="center">
  <img src="https://user-images.githubusercontent.com/1473072/32229482-f90f07d2-be61-11e7-86f1-f9f555182292.png">
</div>
<h1 align="center">await-timeout</h1>
<h5 align="center">A <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a>-based API for setTimeout / clearTimeout</h5>
<div align="center">
  <a href="https://travis-ci.org/vitalets/await-timeout"><img src="https://travis-ci.org/vitalets/await-timeout.svg?branch=master" alt="Build Status" /></a>
  <a href="https://www.npmjs.com/package/await-timeout"><img src="https://img.shields.io/npm/v/await-timeout.svg" alt="Npm version" /></a>
  <a href="https://www.npmjs.com/package/await-timeout"><img src="https://img.shields.io/npm/l/await-timeout.svg" alt="License" /></a>
</div>

## Contents
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [new Timeout()](#new-timeout)
  * [.set()](#setms-message--promise)
  * [.wrap()](#wrappromise-ms-message--promise)
  * [.clear()](#clear)
  * [.id](#id--numbertimeout)
  * [.delay](#delay--number)
* [Motivation](#motivation)
* [Related resources](#related-resources)
* [License](#license)

## Installation
```bash
npm install await-timeout --save
```

## Usage
1. Just wait some time:
    ```js
    import Timeout from 'await-timeout';

    // wait 1000 ms and resolve
    await Timeout.set(1000);
    
    // wait 1000 ms and reject with 'Timeout!'
    await Timeout.set(1000, 'Timeout!');
    ```

2. Use `Timeout` instance inside `try...finally` block to make proper cleanup:
    ```js
    import Timeout from 'await-timeout';

    const timer = new Timeout();
    try {
      await Promise.race([
        fetch('https://example.com'),
        timer.set(1000, 'Timeout!')
      ]);
    } finally {
      timer.clear();
    }
    ```
   > Without a timer cleanup you may get unexpected effects in you code - as all promises in `Promise.race` 
   > are get fulfilled.

## API
### new Timeout()
Constructs new timeout instance. It does not start timer but creates variable for timer manipulation.
```js
const timer = new Timeout();
```
> Note: having separate `timer` variable is useful for clearing timeout in `finally` block 

### .set(delay, [rejectReason]) ⇒ `Promise`
Starts new timer like `setTimeout()` and returns promise. The promise will be resolved after `delay` milliseconds:
```js
const timer = new Timeout();
timer.set(1000)
  .then(() => console.log('1000 ms passed.'));
```

If you provide `rejectReason` - a timer promise will be rejected with specified reason:
```js
// rejects with Error: Timeout after 1000 ms:
timer.set(1000, 'Timeout after 1000 ms');
  
// above is actually shortcut for:
timer.set(1000).then(() => Promise.reject(new Error('Timeout after 1000 ms')));  
```

If you need to just wait some time - use static version of `.set()`:
```js
await Timeout.set(1000);
```

### .wrap(promise, delay, [rejectReason]) ⇒ `Promise`
Wraps existing promise with timeout:
 * returned promise automatically rejected after timeout 
 * timeout automatically cleared if main promise resolves first
```js
async function fetchWithTimeout() {
  const promise = fetch('https://example.com');
  return Timeout.wrap(promise, 1000, 'Timeout');
}
```
Actually it is a shortcut for:
```js
async function fetchWithTimeout() {
    const timer = new Timeout();
    try {
      const promise = fetch('https://example.com');
      return await Promise.race([
        promise,
        timer.set(1000, 'Timeout')
      ]);
    } finally {
      timer.clear();
    }
}
```

### .clear()
Clears existing timeout like `clearTimeout()`.
```js
const timer = new Timeout();
timer.set(1000)
  .then(() => console.log('This will never be called, because timeout is cleared on the next line'));
timer.clear();
```

With [ES7 async / await] `.clear()` can be used in `finally` block:
```js
async function foo() {
  const timer = new Timeout();
  try {
    // some async stuff
  } finally {
    timer.clear();
  }
}
```

### .id ⇒ `?Number|?Timeout`
Returns result of `setTimeout` call. That is `Number` timeout id in browser 
and [Timeout](https://nodejs.org/api/timers.html#timers_class_timeout) instance in Node.js.

### .delay ⇒ `?Number`
Returns last delay value used. Delay is useful for generating reject reason:
```js
const timer = new Timeout();
timer.set(1000, () => new Error(`Timeout: ${timer.delay}`));
```

## Motivation
Before making this library I've researched [several similar packages on Npm](https://www.npmjs.com/search?q=promise%20timeout).
But no one satisfied all my needs together:

1. Convenient way to cancel timeout. I typically use it with [Promise.race()] and don't want timer to trigger
   if main promise is resolved first.
2. API similar to `setTimeout` / `clearTimeout`. I get used to these functions and would like to have mirror syntax.
3. Easy rejection of timeout promise. Passing error message should be enough.
4. No monkey-patching of Promise object.
5. Zero dependencies.

## Related resources
* [The right way to clear timeout in Promise.race()](https://jslive.com/p/3x2x9h-the-right-way-to-clear-timeout-in-promiserace)
* [Applying a timeout to your promises](https://italonascimento.github.io/applying-a-timeout-to-your-promises/)
* [How to make a promise from setTimeout](https://stackoverflow.com/questions/22707475/how-to-make-a-promise-from-settimeout)
* [Is there a version of setTimeout that returns an ES6 promise?](https://stackoverflow.com/questions/34255351/is-there-a-version-of-settimeout-that-returns-an-es6-promise)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)

[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promise.race()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
[ES7 async / await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
