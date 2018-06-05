jest.mock('../../../repositories/MongooseRepository');
import model from '../model';

describe('user', () => {
  describe('model', () => {
    it('contains the proper information that mongoose needs to initialize the schema', () => {
      expect(model.schema).toBeDefined();
      expect(model.collectionName).toBe('users');
      expect(model.schemaName).toBe('Users');
    });
  });
});
