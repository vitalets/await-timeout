describe('clear', function () {
  beforeEach(function () {
    this.timeout = new Timeout();
    this.triggered = false;
  });

  it('should clear timeout', function () {
    this.timeout.set(50).then(() => this.triggered = true);
    sleep(20).then(() => this.timeout.clear());
    return sleep(60).then(() => assert.equal(this.triggered, false));
  });
});
