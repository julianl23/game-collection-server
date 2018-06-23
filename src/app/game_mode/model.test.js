jest.mock('../../repositories/MongooseRepository');
import model from './model';

describe('game_mode', () => {
  describe('model', () => {
    it('contains the proper information that mongoose needs to initialize the schema', () => {
      expect(model.schema).toBeDefined();
      expect(model.collectionName).toBe('gamemodes');
      expect(model.schemaName).toBe('GameModes');
    });
  });
});
