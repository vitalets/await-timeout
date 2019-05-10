/**
 * Promise-based replacement for setTimeout / clearTimeout.
 */

import {promiseFinally, toError} from './utils';

class Timeout {
  constructor() {
    this._id = null;
  }

  get id() {
    return this._id;
  }

  set(ms, error = '') {
    return new Promise((resolve, reject) => {
      this.clear();
      const fn = error ? () => reject(toError(error)) : resolve;
      this._id = setTimeout(fn, ms);
    });
  }

  wrap(promise, ms, error = '') {
    const wrappedPromise = promiseFinally(promise, () => this.clear());
    const timer = this.set(ms, error);
    return Promise.race([wrappedPromise, timer]);
  }

  clear() {
    if (this._id) {
      clearTimeout(this._id);
    }
  }
}

Timeout.set = function (ms, error) {
  return new Timeout().set(ms, error);
};

Timeout.wrap = function (promise, ms, error) {
  return new Timeout().wrap(promise, ms, error);
};

export default Timeout;
