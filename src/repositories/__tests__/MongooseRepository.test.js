import MongooseRepository from '../MongooseRepository';

jest.mock('mongoose', () => {
  return {
    model: jest.fn().mockImplementation(() => {
      return {
        find: val => val,
        create: () => ({ _id: 12345 }),
        findOne: val => val,
        findOneAndRemove: val => val,
        insertMany: val => val,
        update: val => val,
        updateOne: val => val,
        search: val => val
      };
    }),
    Schema: jest.fn()
  };
});

jest.mock('elasticsearch', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      search: jest.fn().mockImplementation(() => ({
        hits: {
          hits: []
        }
      })),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn()
    }))
  };
});

describe('repositories', () => {
  describe('MongooseRepository', () => {
    class ImplementedTest extends MongooseRepository {
      get schema() {
        return {};
      }

      get collectionName() {
        return 'test';
      }

      get schemaName() {
        return 'test';
      }
    }

    it('throws an error when a schema is not implemented', () => {
      function testInit() {
        new MongooseRepository();
      }

      expect(testInit).toThrowErrorMatchingSnapshot();
    });

    it('throws an error when trying to access an unimplemented collectionName getter', () => {
      class Test extends MongooseRepository {
        get schema() {
          return {};
        }

        get schemaName() {
          return 'test';
        }
      }

      function testInit() {
        new Test();
      }

      expect(testInit).toThrowErrorMatchingSnapshot();
    });

    it('throws an error if you have not specified a schemaName', () => {
      class Test extends MongooseRepository {
        get schema() {
          return {};
        }

        get collectionName() {
          return 'test';
        }
      }

      expect(() => new Test()).toThrowError(
        'Not implemented. Please provide a schemaName in you class definition'
      );
    });

    it('calls the correct find function', () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = testInstance.find();

      expect(value).toEqual(expected);
    });

    it('calls the correct create function', async () => {
      const testInstance = new ImplementedTest();
      const expected = { _id: 12345 };

      const value = await testInstance.create();

      expect(value).toEqual(expected);
    });

    it('calls the correct findOne function', () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = testInstance.findOne();

      expect(value).toEqual(expected);
    });

    it('calls the correct findOneAndRemove function', async () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = await testInstance.findOneAndRemove();

      expect(value).toEqual(expected);
    });

    it('calls the correct insertMany function', () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = testInstance.insertMany();

      expect(value).toEqual(expected);
    });

    it('calls the correct update function', () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = testInstance.update();

      expect(value).toEqual(expected);
    });

    it('calls the correct updateOne function', async () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = await testInstance.updateOne();

      expect(value).toEqual(expected);
    });

    it('calls the correct search function', async () => {
      const testInstance = new ImplementedTest();
      const expected = [];

      const value = await testInstance.search();

      expect(value).toEqual(expected);
    });
  });
});
