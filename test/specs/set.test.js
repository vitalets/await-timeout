describe('set', function () {
  beforeEach(function () {
    this.timeout = new Timeout();
  });

  afterEach(function () {
    this.timeout.clear();
  });

  it('should resolve after required ms', function () {
    const spy = sinon.spy();
    this.timeout.set(50).then(spy);
    return Promise.all([
      sleep(45).then(() => sinon.assert.notCalled(spy)),
      sleep(55).then(() => sinon.assert.calledOnce(spy)),
    ]);
  });

  it('should reject after delay if message is defined', function () {
    return this.timeout.set(50, 'Timeout')
      .then(
        () => assert.fail('should throw'),
        e => assert.equal(e.message, 'Timeout')
      );
  });

  it('should clear existing timer on second set call', function () {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    this.timeout.set(20).then(spy1);
    setTimeout(() => this.timeout.set(10).then(spy2), 0);
    return sleep(30).then(() => {
      sinon.assert.notCalled(spy1);
      sinon.assert.calledOnce(spy2);
    });
  });
});

describe('Timeout.set', function () {
  it('should be exported', function () {
    assert.ok(Timeout.set instanceof Function);
  });

  it('should resolve after required', function () {
    const spy = sinon.spy();
    Timeout.set(50).then(spy);
    return Promise.all([
      sleep(45).then(() => sinon.assert.notCalled(spy)),
      sleep(55).then(() => sinon.assert.calledOnce(spy)),
    ]);
  });

  it('should reject after delay if message is defined', function () {
    return Timeout.set(50, 'Timeout')
      .then(
        () => assert.fail('should throw'),
        e => assert.equal(e.message, 'Timeout')
      );
  });
});
