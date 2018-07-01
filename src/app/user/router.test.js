import router from './router';

jest.mock('./controller');

describe('user', () => {
  describe('router', () => {
    describe('/api/users', () => {
      it('has the correct structure', () => {
        expect(router).toMatchSnapshot();
      });
    });
  });
});
