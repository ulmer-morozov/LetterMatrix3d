import { Lettermatrix3dPage } from './app.po';

describe('lettermatrix3d App', () => {
  let page: Lettermatrix3dPage;

  beforeEach(() => {
    page = new Lettermatrix3dPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
