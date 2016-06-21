describe('haru app', function() {
  it('should have a title', function() {
    browser.get('https://haruapp.surge.sh/');

    browser.waitForAngular();

    expect(browser.getTitle()).toEqual('Haru');
  });
});