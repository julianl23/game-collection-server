import Boom from 'boom';
import { get, addGame } from './controller';
import GameCollection from './model';
import User from '../user/model';

jest.mock('./model', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndRemove: jest.fn(),
  save: jest.fn()
}));

jest.mock('./../user/model', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndRemove: jest.fn(),
  save: jest.fn()
}));

describe('gamecollections', () => {
  describe('addGame', () => {
    it('adds a game to the users collection when the user is authorized', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          id: '123456789012'
        },
        auth: {
          credentials: {
            id: '234567890123'
          }
        }
      };

      const mockUser = {
        _id: '234567890123',
        gameCollection: {
          items: ['345678901234'],
          save: jest.fn()
        }
      };

      const mockUserWithPopulate = {
        populate: jest.fn(() => mockUser)
      };

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn()
        })
      };

      User.findOne.mockImplementationOnce(() => mockUserWithPopulate);
      GameCollection.save.mockImplementationOnce(() => mockUser);

      await addGame.handler(mockRequest, h);
      expect(h.response).toHaveBeenCalledWith({
        gameCollection: mockUser.gameCollection.items
      });
    });

    it('returns an error if no game id is passed in', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {}
      };

      const result = await addGame.handler(mockRequest);
      expect(result).toEqual(Boom.badData('Game ID is required'));
    });

    it('returns an error if the user cannot be authorized', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          id: '123456789012'
        },
        auth: {
          credentials: {
            id: null
          }
        }
      };

      const mockUserWithPopulate = {
        populate: jest.fn(() => null)
      };

      User.findOne.mockImplementationOnce(() => mockUserWithPopulate);
      const result = await addGame.handler(mockRequest);
      expect(result).toEqual(Boom.unauthorized('Invalid credentials'));
    });
  });

  describe('get', () => {
    it('returns a collection for a specified id', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          collectionId: '123456789012'
        }
      };

      const expectedCollection = ['2345678901223'];

      GameCollection.findOne.mockImplementationOnce(() => expectedCollection);
      const results = await get.handler(mockRequest);
      expect(results).toEqual({
        gameCollection: expectedCollection
      });
    });

    it('returns an error if no collection id is passed in', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {}
      };

      const results = await get.handler(mockRequest);
      expect(results).toEqual(Boom.badData('Collection ID is required'));
    });
  });
});
