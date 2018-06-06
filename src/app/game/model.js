import MongooseRepository from '../../repositories/MongooseRepository';

class GameRepository extends MongooseRepository {
  get schema() {
    return {
      title: { type: String, required: true },
      developer: String,
      publisher: String,
      platform: { type: String, required: true },
      releaseDate: Date,
      description: String
    };
  }

  get collectionName() {
    return 'games';
  }

  get schemaName() {
    return 'Games';
  }
}

/* Export the model for execution */
export default new GameRepository();
