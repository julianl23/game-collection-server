import mongoose from 'mongoose';
import MongooseRepository from '../../repositories/MongooseRepository';

class PlatformRepository extends MongooseRepository {
  get schema() {
    return {
      igdbId: Number,
      name: { type: String, required: true },
      logo: {
        url: String,
        cloudinary_id: String,
        width: Number,
        height: Number
      },
      games: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Games'
        }
      ]
    };
  }

  get collectionName() {
    return 'platforms';
  }

  get schemaName() {
    return 'Platforms';
  }
}

/* Export the model for execution */
export default new PlatformRepository();
