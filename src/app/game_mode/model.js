import MongooseRepository from '../../repositories/MongooseRepository';

class GameModeRepository extends MongooseRepository {
  get schema() {
    return {
      igdbId: Number,
      name: { type: String, required: true }
    };
  }

  get collectionName() {
    return 'gamemodes';
  }

  get schemaName() {
    return 'GameModes';
  }
}

/* Export the model for execution */
export default new GameModeRepository();
