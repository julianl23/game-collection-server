import mongoose from 'mongoose';
import MongooseRepository from '../../repositories/MongooseRepository';

class GameRepository extends MongooseRepository {
  get schema() {
    return {
      igdbId: Number,
      title: { type: String, required: true },
      developer: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Companies'
        }
      ],
      publisher: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Companies'
        }
      ],
      platform: String,
      releaseDate: Date,
      description: String,
      cover: {
        url: String,
        width: Number,
        height: Number
      }
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
