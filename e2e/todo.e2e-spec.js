describe('haru app', function() {

  beforeEach(()=> {
    browser.get('');
  });
  it('should have a title', function() {
    //This is just for passing test, it should be removed eventually.
    browser.ignoreSynchronization = true;

    expect(browser.getTitle()).toEqual('Haru');
  });
});
