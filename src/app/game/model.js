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
      platforms: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Platforms'
        }
      ],
      releaseDate: Date,
      description: String,
      cover: {
        url: String,
        width: Number,
        height: Number,
        cloudinary_id: String
      },
      gameModes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'GameModes'
        }
      ],
      multiplayerModes: [
        {
          platform: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Platforms'
          },
          offlinecoop: Boolean,
          onlinecoop: Boolean,
          lancoop: Boolean,
          campaigncoop: Boolean,
          splitscreenonline: Boolean,
          splitscreen: Boolean,
          dropin: Boolean,
          offlinecoopmax: Number,
          onlinecoopmax: Number,
          onlinemax: Number,
          offlinemax: Number
        }
      ]
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
