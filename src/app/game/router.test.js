import router from './router';

jest.mock('./controller');

describe('game', () => {
  describe('router', () => {
    describe('/api/games', () => {
      it('has the correct structure', () => {
        expect(router).toMatchSnapshot();
      });
    });
  });
});
