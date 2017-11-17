describe('Timeout', function () {
  beforeEach(function () {
    this.timeout = new Timeout();
  });

  it('should export class', function () {
    assert.ok(Timeout instanceof Function);
  });

  it('should resolve after required ms', function () {
    const t = Date.now();
    return this.timeout.set(50)
      .then(() => {
        const duration = Date.now() - t;
        assert.ok(Math.abs(duration - 50) < 10);
      });
  });

  it('should reject after delay ms if message defined', function () {
    return this.timeout.set(50, 'Timeout')
      .catch(e => assert.equal(e.message, 'Timeout'));
  });

  it('should clear timeout', function () {
    return Promise.race([
      this.timeout.set(50).then(() => 'triggered'),
      wait(20).then(() => this.timeout.clear())
    ])
      .then(result => assert.equal(result, undefined));
  });
});
