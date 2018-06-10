import MongooseRepository from '../../repositories/MongooseRepository';
import { Schema } from 'mongoose';

class GameCollectionRepository extends MongooseRepository {
  get schema() {
    return {
      owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      items: [{ type: Schema.Types.ObjectId, ref: 'Games' }]
    };
  }

  get collectionName() {
    return 'gamecollections';
  }

  get schemaName() {
    return 'GameCollections';
  }
}

/* Export the model for execution */
export default new GameCollectionRepository();
