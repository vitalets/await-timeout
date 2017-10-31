/**
 * Promise-based replacement for setTimeout / clearTimeout.
 */

export default class Timeout {
  constructor() {
    this._id = null;
  }

  set(ms, msg = '') {
    return new Promise((resolve, reject) => {
      const fn = msg ? () => reject(new Error(msg)) : resolve;
      this._id = setTimeout(fn, ms);
    });
  }

  clear() {
    clearTimeout(this._id);
  }
}
