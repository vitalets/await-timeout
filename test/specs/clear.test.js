describe('clear', function () {
  beforeEach(function () {
    this.timeout = new Timeout();
  });

  it('should clear timeout', function () {
    const spy = sinon.spy();
    this.timeout.set(50).then(spy);
    sleep(20).then(() => this.timeout.clear());
    return sleep(60).then(() => sinon.assert.notCalled(spy));
  });
});
