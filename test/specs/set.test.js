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

  it('should reject if message is string ', function () {
    return assert.rejects(this.timeout.set(50, 'Timeout'), /Timeout/);
  });

  it('should reject if message is Error', function () {
    return assert.rejects(this.timeout.set(50, new Error('Timeout')), /Timeout/);
  });

  it('should reject if message is function returning Error', function () {
    return assert.rejects(this.timeout.set(50, () => new Error('Timeout')), /Timeout/);
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

  it('should return id property', function () {
    assert.equal(this.timeout.id, null);
    this.timeout.set(50);
    assert.ok(this.timeout.id);
  });

  it('should return delay property', async function () {
    assert.equal(this.timeout.delay, null);
    const promise = this.timeout.set(10);
    assert.equal(this.timeout.delay, 10);
    await promise;
    assert.equal(this.timeout.delay, 10);
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
    return assert.rejects(Timeout.set(50, 'Timeout'), /Timeout/);
  });
});
