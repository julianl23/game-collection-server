import MongooseRepository from '../../repositories/MongooseRepository';
import { Schema } from 'mongoose';

class GameCollectionRepository extends MongooseRepository {
  get schema() {
    return {
      owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      items: [
        {
          game: { type: Schema.Types.ObjectId, ref: 'Games' },
          platform: { type: Schema.Types.ObjectId, ref: 'Platforms' },
          note: {
            text: String,
            isPrivate: Boolean
          },
          borrowed: Boolean,
          borrowedDate: Date,
          cost: Number,
          details: {
            hasCartDiskItem: Boolean,
            hasCaseBox: Boolean,
            hasManual: Boolean,
            hasOtherInserts: Boolean
          }
        }
      ]
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
