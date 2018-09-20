export function promiseFinally(promise, fn) {
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
