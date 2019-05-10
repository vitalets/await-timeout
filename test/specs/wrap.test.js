
describe('Timeout.wrap', function () {
  it('should be exported', function () {
    assert.ok(Timeout.wrap instanceof Function);
  });

  it('should reject after timeout with correct message', function () {
    const promise = sleep(100);
    const wrapped = Timeout.wrap(promise, 50, 'Timeout');
    return assert.rejects(wrapped, /Timeout/);
  });

  it('should clear timeout and return result if wrapped promise resolved', function () {
    const promise = sleep(50).then(() => 'foo');
    const wrapped = Timeout.wrap(promise, 100, 'Timeout');
    return wrapped
      .then(res => assert.equal(res, 'foo'));
  });

  it('should clear timeout and reject if wrapped promise rejected', function () {
    const promise = sleep(50).then(() => Promise.reject('foo'));
    const wrapped = Timeout.wrap(promise, 100, 'Timeout');
    return assert.rejects(wrapped, /foo/);
  });
});
