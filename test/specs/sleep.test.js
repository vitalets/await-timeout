
describe('Timeout.sleep', function () {
  it('should be exported', function () {
    assert.ok(Timeout.sleep instanceof Function);
  });

  it('should resolve after required', function () {
    const t = Date.now();
    return Timeout.sleep(50)
      .then(() => {
        const duration = Date.now() - t;
        assert.ok(Math.abs(duration - 50) < 10);
      });
  });
});
