/**
 * Promise-based replacement for setTimeout / clearTimeout.
 */

class Timeout {
  constructor() {
    this._id = null;
  }

  set(ms, msg = '') {
    return new Promise((resolve, reject) => {
      const fn = msg ? () => reject(new Error(msg)) : resolve;
      this._id = setTimeout(fn, ms);
    });
  }

  wrap(promise, ms, msg = '') {
    const wrappedPromise = promiseFinally(promise, () => this.clear());
    const timer = this.set(ms, msg);
    return Promise.race([wrappedPromise, timer]);
  }

  clear() {
    clearTimeout(this._id);
  }
}

Timeout.set = function (ms, msg) {
  return new Timeout().set(ms, msg);
};

Timeout.wrap = function (promise, ms, msg) {
  return new Timeout().wrap(promise, ms, msg);
};

function promiseFinally(promise, fn) {
  const success = result => {
    fn();
    return result;
  };
  const error = e => {
    fn();
    return Promise.reject(e);
  };
  return Promise.resolve(promise).then(success, error);
}

export default Timeout;
