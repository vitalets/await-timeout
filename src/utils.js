exports.promiseFinally = (promise, fn) => {
  const success = result => {
    fn();
    return result;
  };
  const error = e => {
    fn();
    return Promise.reject(e);
  };
  return Promise.resolve(promise).then(success, error);
};

/**
 * Converts any value to Error.
 * @param {*} value
 * @returns {Error}
 */
exports.toError = value => {
  value = typeof value === 'function' ? value() : value;
  return typeof value === 'string' ? new Error(value) : value;
};
