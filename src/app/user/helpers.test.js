import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { hashPassword, getToken, verifyCredentials } from './helpers';
import User from './model';

jest.mock('./model', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndRemove: jest.fn()
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('user', () => {
  describe('helpers', () => {
    describe('hashPassword', () => {
      it('returns a hashed version of a password', async () => {
        bcrypt.hash.mockImplementationOnce((pw, saltRounds, cb) => {
          cb(null, '12345');
        });

        const hashed = await hashPassword('12345');
        expect(hashed).toEqual('12345');
      });

      it('rejects if an error occurred', async () => {
        bcrypt.hash.mockImplementationOnce((pw, saltRounds, cb) => {
          cb('error');
        });

        await expect(hashPassword('12345')).rejects.toEqual('error');
      });
    });

    describe('getToken', () => {
      it('returns a token for a given id', () => {
        jwt.sign.mockImplementationOnce(() => '123');
        const token = getToken('123');
        expect(token).toEqual('123');
      });
    });

    describe('verifyCredentials', () => {
      const userMock = {
        id: 1,
        email: 'test@test.com',
        username: 'Tester',
        password:
          '$2b$10$p4sMc14J4Mllzb4ywTI.6.ckLmtV8SEwBTVudHb7wcPZheoCSmA/.',
        firstName: 'Tester',
        lastName: 'McGee'
      };

      it('returns a user if the credentials are valid', async () => {
        bcrypt.compare.mockImplementationOnce((pw1, pw2, cb) => {
          cb(null, true);
        });

        User.findOne.mockImplementationOnce(() => userMock);

        const request = {
          payload: {
            email: 'test@tester.com',
            password: 'password'
          }
        };

        const verified = await verifyCredentials(request);
        expect(verified).toEqual(userMock);
      });

      it('returns an error if a users password is invalid', async () => {
        bcrypt.compare.mockImplementationOnce((pw1, pw2, cb) => {
          cb(
            {
              error: 'password invalid'
            },
            false
          );
        });

        User.findOne.mockImplementationOnce(() => userMock);

        const request = {
          payload: {
            email: 'test@tester.com',
            password: 'password1'
          }
        };

        await expect(verifyCredentials(request)).rejects.toEqual({
          error: 'password invalid'
        });
      });

      it('returns false if a user cannot be found', async () => {
        User.findOne.mockImplementationOnce(() => null);

        const request = {
          payload: {
            email: 'test1@tester.com',
            password: 'password1'
          }
        };

        const verified = await verifyCredentials(request);
        expect(verified).toEqual(false);
      });
    });
  });
});
