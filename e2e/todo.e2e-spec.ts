describe('haru app', ()=> {

  beforeEach(()=> {
    browser.get('');
  });
  it('should have a title', ()=> {
    browser.ignoreSynchronization = true;

    expect(browser.getTitle()).toEqual('Haru');
  });
});
