jest.mock('../../repositories/MongooseRepository');
import model from './model';
// import GameCollection from '../game_collection/model';

describe('user', () => {
  describe('model', () => {
    it('contains the proper information that mongoose needs to initialize the schema', () => {
      expect(model.schema).toBeDefined();
      expect(model.collectionName).toBe('users');
      expect(model.schemaName).toBe('Users');
    });

    // it('creates a game collection for new users', async () => {
    //   jest.mock('mongoose', () => {
    //     const userMock = {
    //       _id: 1,
    //       email: 'test@test.com',
    //       username: 'Tester',
    //       password:
    //         '$2b$10$p4sMc14J4Mllzb4ywTI.6.ckLmtV8SEwBTVudHb7wcPZheoCSmA/.',
    //       firstName: 'Tester',
    //       lastName: 'McGee'
    //     };

    //     return {
    //       model: jest.fn(() => {
    //         return {
    //           find: val => val,
    //           create: () => userMock,
    //           findOne: val => val,
    //           findOneAndRemove: val => val,
    //           insertMany: val => val,
    //           update: val => val,
    //           updateOne: val => val,
    //           search: val => val
    //         };
    //       }),
    //       Schema: jest.fn()
    //     };
    //   });

    //   jest.mock('../game_collection/model', () => ({
    //     find: jest.fn(),
    //     create: jest.fn(),
    //     findOne: jest.fn(),
    //     findOneAndRemove: jest.fn()
    //   }));

    //   // GameCollection.create.mockImplementationOnce(() => ({
    //   //   _id: '123'
    //   // }));

    //   await model.create({
    //     _id: 1,
    //     email: 'test@test.com',
    //     username: 'Tester',
    //     password:
    //       '$2b$10$p4sMc14J4Mllzb4ywTI.6.ckLmtV8SEwBTVudHb7wcPZheoCSmA/.',
    //     firstName: 'Tester',
    //     lastName: 'McGee'
    //   });

    //   expect(GameCollection.create).toHaveBeenCalledWith({
    //     owner: 1,
    //     items: []
    //   });
    //   expect(model.save).toHaveBeenCalled();
    // });
  });
});
