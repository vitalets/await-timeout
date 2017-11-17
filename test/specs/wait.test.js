
describe('Timeout.wait', function () {
  it('should be exported', function () {
    assert.ok(Timeout.wait instanceof Function);
  });

  it('should resolve after required', function () {
    const t = Date.now();
    return Timeout.wait(50)
      .then(() => {
        const duration = Date.now() - t;
        assert.ok(Math.abs(duration - 50) < 10);
      });
  });
});
