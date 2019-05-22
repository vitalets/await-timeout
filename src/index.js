/**
 * Promise-based replacement for setTimeout / clearTimeout.
 */

import {promiseFinally, toError} from './utils';

class Timeout {
  constructor() {
    this._id = null;
    this._delay = null;
  }

  get id() {
    return this._id;
  }

  get delay() {
    return this._delay;
  }

  set(delay, rejectReason = '') {
    return new Promise((resolve, reject) => {
      this.clear();
      const fn = rejectReason ? () => reject(toError(rejectReason)) : resolve;
      this._id = setTimeout(fn, delay);
      this._delay = delay;
    });
  }

  wrap(promise, delay, rejectReason = '') {
    const wrappedPromise = promiseFinally(promise, () => this.clear());
    const timer = this.set(delay, rejectReason);
    return Promise.race([wrappedPromise, timer]);
  }

  clear() {
    if (this._id) {
      clearTimeout(this._id);
    }
  }
}

Timeout.set = function (delay, rejectReason) {
  return new Timeout().set(delay, rejectReason);
};

Timeout.wrap = function (promise, delay, rejectReason) {
  return new Timeout().wrap(promise, delay, rejectReason);
};

export default Timeout;
