describe('haru app', function() {

  beforeEach(()=> {
    browser.get('');
  });
  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Haru');
  });
});