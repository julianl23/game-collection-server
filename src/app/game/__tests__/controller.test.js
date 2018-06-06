import Boom from 'boom';
import { getList, put } from '../controller';
import Game from '../model';

jest.mock('../model', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndRemove: jest.fn()
}));

describe('games', () => {
  describe('getList', () => {
    it('returns a list of games', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {}
      };

      const expectedGameList = [
        {
          title: 'Super Mario Bros.',
          platform: 'Nintendo Entertainment System'
        }
      ];

      Game.find.mockImplementationOnce(() => expectedGameList);
      const results = await getList.handler(mockRequest);
      expect(results).toEqual({
        games: expectedGameList
      });
    });
  });

  describe('put', () => {
    it('returns a game if one is created', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          title: 'Super Mario Bros.',
          publisher: 'Nintendo',
          developer: 'EAD',
          platform: 'Nintendo Entertainment System'
        }
      };

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn()
        })
      };

      Game.find.mockImplementationOnce(() => []);
      Game.create.mockImplementationOnce(() => ({
        ...mockRequest.payload
      }));

      await put.handler(mockRequest, h);
      expect(h.response).toHaveBeenCalledWith({
        game: {
          ...mockRequest.payload
        }
      });
    });

    it('returns an error if data is invalid', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          title: ''
        }
      };

      const result = await put.handler(mockRequest);
      expect(result).toEqual(
        Boom.badData('"title" is not allowed to be empty')
      );
    });

    it('returns an error if game already exists', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          title: 'Super Mario Bros.',
          publisher: 'Nintendo',
          developer: 'EAD',
          platform: 'Nintendo Entertainment System'
        }
      };

      Game.find.mockImplementationOnce(() => [
        {
          ...mockRequest.payload
        }
      ]);

      const result = await put.handler(mockRequest);
      expect(result).toEqual(Boom.badRequest('Game already exists'));
    });
  });
});
