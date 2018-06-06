import MongooseRepository from '../MongooseRepository';

jest.mock('mongoose', () => {
  return {
    model: jest.fn(() => {
      return {
        find: val => val,
        create: val => val,
        findOne: val => val,
        findOneAndRemove: val => val
      };
    }),
    Schema: jest.fn()
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

    it('calls the correct create function', () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = testInstance.create();

      expect(value).toEqual(expected);
    });

    it('calls the correct findOne function', () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = testInstance.findOne();

      expect(value).toEqual(expected);
    });

    it('calls the correct findOneAndRemove function', () => {
      const testInstance = new ImplementedTest();
      const expected = {};

      const value = testInstance.findOneAndRemove();

      expect(value).toEqual(expected);
    });
  });
});
