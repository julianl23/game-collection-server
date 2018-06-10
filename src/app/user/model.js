import mongoose from 'mongoose';
import MongooseRepository from '../../repositories/MongooseRepository';
import GameCollection from '../game_collection/model';

class UserRepository extends MongooseRepository {
  get schema() {
    return {
      email: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      firstName: String,
      lastName: String,
      admin: Boolean,
      gameCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameCollections'
      }
    };
  }

  get collectionName() {
    return 'users';
  }

  get schemaName() {
    return 'Users';
  }

  async create(opts = {}) {
    const user = await this.Model.create(opts);
    const collection = await GameCollection.create({
      owner: user._id,
      items: []
    });
    user.gameCollection = collection._id;
    await user.save();
    return user;
  }
}

/* Export the model for execution */
export default new UserRepository();
