import router from '../router';

jest.mock('../controller');

describe('gamecollection', () => {
  describe('router', () => {
    describe('/api/collection', () => {
      it('has the correct structure', () => {
        expect(router).toMatchSnapshot();
      });
    });
  });
});
