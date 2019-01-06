import MongooseRepository from '../../repositories/MongooseRepository';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

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

  async addGame(collectionId, payload) {
    if (!payload || !payload._id) {
      throw new Error('Game ID is required');
    }

    const {
      platform,
      borrowed,
      borrowedDate,
      cost,
      note,
      details,
      _id
    } = payload;
    const gameId = mongoose.Types.ObjectId(_id);

    const collection = await this.findOne({
      _id: collectionId
    });

    let collectionItem = {
      game: gameId,
      platform: mongoose.Types.ObjectId(platform),
      borrowed,
      borrowedDate,
      cost
    };

    if (note) {
      collectionItem.note = note;
    }

    if (details) {
      collectionItem.details = details;
    }

    collection.items.push(collectionItem);

    try {
      await collection.save();
      return collection;
    } catch (e) {
      throw e;
    }
  }
}

/* Export the model for execution */
export default new GameCollectionRepository();
