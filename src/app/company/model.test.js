jest.mock('../../repositories/MongooseRepository');
import model from './model';

describe('company', () => {
  describe('model', () => {
    it('contains the proper information that mongoose needs to initialize the schema', () => {
      expect(model.schema).toBeDefined();
      expect(model.collectionName).toBe('companies');
      expect(model.schemaName).toBe('Companies');
    });
  });
});
