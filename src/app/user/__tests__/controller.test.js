import Boom from 'boom';
import { getList, put, login } from '../controller';
import { getToken, verifyCredentials } from '../helpers';
import User from '../model';

jest.mock('../model', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndRemove: jest.fn()
}));

jest.mock('../helpers', () => ({
  getToken: jest.fn(),
  hashPassword: jest.fn(),
  verifyCredentials: jest.fn()
}));

describe('users', () => {
  describe('getList', () => {
    it('returns a list of users', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {}
      };

      const expectedUserList = [
        {
          email: 'test@test.com',
          password: '123456'
        }
      ];

      User.find.mockImplementationOnce(() => expectedUserList);
      const results = await getList.handler(mockRequest);
      expect(results).toEqual({
        users: expectedUserList
      });
    });
  });

  describe('put', () => {
    it('returns a user if one is created', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          email: 'test@test.com',
          username: 'Tester',
          password: 'password',
          firstName: 'Tester',
          lastName: 'McGee'
        }
      };

      const userMock = {
        id: 1,
        email: 'test@test.com',
        username: 'Tester',
        password:
          '$2b$10$p4sMc14J4Mllzb4ywTI.6.ckLmtV8SEwBTVudHb7wcPZheoCSmA/.',
        firstName: 'Tester',
        lastName: 'McGee'
      };

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn()
        })
      };

      getToken.mockImplementationOnce(() => '12345');
      User.find.mockImplementationOnce(() => []);
      User.create.mockImplementationOnce(() => ({
        ...userMock
      }));

      await put.handler(mockRequest, h);
      expect(h.response).toHaveBeenCalledWith({
        user: {
          email: userMock.email,
          username: userMock.username,
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          token: '12345'
        }
      });
    });

    it('returns an error if the user already exists', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          email: 'test@test.com',
          username: 'Tester',
          password: 'password',
          firstName: 'Tester',
          lastName: 'McGee'
        }
      };

      User.find.mockImplementationOnce(() => [
        {
          email: 'test@test.com'
        }
      ]);

      const result = await put.handler(mockRequest);
      expect(result).toEqual(Boom.badRequest('User already exists'));
    });

    it('returns an error if the provided data is invalid', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          email: 'test@test.com',
          username: 'Tester',
          password: '',
          firstName: 'Tester',
          lastName: 'McGee'
        }
      };

      const result = await put.handler(mockRequest);
      expect(result).toEqual(
        Boom.badData('"password" is not allowed to be empty')
      );
    });
  });

  describe('login', () => {
    it('returns a user and token if credentials are valid', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          email: 'test@test.com',
          password: 'password'
        }
      };

      const expectedUser = {
        id: '12345',
        email: 'test@test.com',
        username: 'Tester',
        firstName: 'Tester',
        lastName: 'McGee'
      };

      verifyCredentials.mockImplementationOnce(() => expectedUser);
      getToken.mockImplementationOnce(() => '12345');

      const result = await login.handler(mockRequest);
      expect(result).toEqual({
        user: {
          ...expectedUser,
          token: '12345'
        }
      });
    });

    it('returns an error if credentials are invalid', async () => {
      const mockRequest = {
        query: {},
        params: {},
        payload: {
          email: 'test@test.com',
          password: 'passwordwrong'
        }
      };

      verifyCredentials.mockImplementationOnce(() => null);
      const result = await login.handler(mockRequest);
      expect(result).toEqual(Boom.unauthorized('Invalid credentials'));
    });
  });
});
