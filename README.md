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
  * [.wrap()](#wrap-promise-ms-message--promise)
  * [.clear()](#clear)
* [Motivation](#motivation)
* [Related resources](#related-resources)
* [License](#license)

## Installation
```bash
npm install await-timeout --save
```

## Usage
The example below shows how to set timeout for fetching `example.com` using [ES7 async / await] syntax. 
The code is wrapped into `try...finally` block that guarantees the timeout will be properly cleared:
```js
import Timeout from 'await-timeout';

async function foo() {
  const timeout = new Timeout();
  try {
    const fetchPromise = fetch('https://example.com');
    const timerPromise = timeout.set(1000, 'Timeout!');
    return await Promise.race([fetchPromise, timerPromise]);
  } catch (e) {
    console.error(e);
  } finally {
    timeout.clear();
  }
}
```
The same example with `.then`:
```js
function foo() {
  const timeout = new Timeout();
  return Promise.race([
    fetch('https://example.com'), 
    timeout.set(1000, 'Timeout!')
  ])
  .then(result => {
    timeout.clear();
    return result;
  })
  .catch(e => {
    timeout.clear();
    console.error(e);
  });
}
```

The same example using [Timeout.wrap()](#wrap-promise-ms-message--promise) has less code:
```js
function foo() {
  const promise = fetch('https://example.com');
  return Timeout.wrap(promise, 1000, 'Timeout!').catch(e => console.error(e));
}
```

## API
### new Timeout()
Constructs new timeout instance. It does not start timer but creates variable for timer manipulation.
```js
const timeout = new Timeout();
```
> Note: having separate variable is useful for clearing timeout in `finally` block 

### .set(ms, [message]) ⇒ `Promise`
Starts new timer like `setTimeout()` and returns promise. The promise will be resolved after `ms` milliseconds:
```js
const timeout = new Timeout();
timeout.set(1000)
  .then(() => console.log('1000 ms passed.'));
```

If you need to reject after timeout:
```js
timeout.set(1000)
  .then(() => {throw new Error('Timeout')});
```

Or reject with custom error:
```js
timeout.set(1000)
  .then(() => {throw new MyTimeoutError()});
```
The second parameter `message` is just convenient way to reject with `new Error(message)`:
```js
timeout.set(1000, 'Timeout');
// equivalent to
timeout.set(1000).then(() => {throw new Error('Timeout')});
```

If you need to just wait some time - use static version of `.set()`:
```js
Timeout.set(1000).then(...);
```

### .wrap(promise, ms, [message]) ⇒ `Promise`
Wraps promise into timeout that automatically cleared if promise gets fulfilled.
```js
Timeout.wrap(fetch('https://example.com'), 1000, 'Timeout!')
  .catch(e => console.error(e));
```

### .clear()
Clears existing timeout like `clearTimeout()`.
```js
const timeout = new Timeout();
timeout.set(1000)
  .then(() => console.log('This will never be called, because timeout is cleared on the next line'));
timeout.clear();
```

With [ES7 async / await] `.clear()` can be used in `finally` block:
```js
async function foo() {
  const timeout = new Timeout();
  try {
    // some async stuff
  } finally {
    timeout.clear();
  }
}
```

## Motivation
Before making this library I've researched [many similar packages on Npm](https://www.npmjs.com/search?q=promise%20timeout).
But no one satisfied all my needs together:

1. Convenient way to cancel timeout. I typically use it with [Promise.race()] and don't want timer to trigger
   if main promise is fulfilled first.
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
