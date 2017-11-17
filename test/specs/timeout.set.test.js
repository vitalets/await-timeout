
describe('Timeout.set', function () {
  it('should be exported', function () {
    assert.ok(Timeout.set instanceof Function);
  });

  it('should resolve after required', function () {
    const t = Date.now();
    return Timeout.set(50)
      .then(() => {
        const duration = Date.now() - t;
        assert.ok(Math.abs(duration - 50) < 10);
      });
  });
});
