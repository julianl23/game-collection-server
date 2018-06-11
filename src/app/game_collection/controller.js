import Boom from 'boom';
import mongoose from 'mongoose';
import User from '../user/model';
import GameCollection from './model';

export const addGame = {
  handler: async (request, h) => {
    if (!request.payload || !request.payload.id) {
      return Boom.badData('Game ID is required');
    }

    const gameId = mongoose.Types.ObjectId(request.payload.id);
    const userId = mongoose.Types.ObjectId(request.auth.credentials.id);

    const user = await User.findOne({
      _id: userId
    }).populate('gameCollection');

    if (!user) {
      return Boom.unauthorized('Invalid credentials');
    }

    user.gameCollection.items.push({
      _id: mongoose.Types.ObjectId(gameId)
    });

    await user.gameCollection.save();

    return h
      .response({
        gameCollection: user.gameCollection.items
      })
      .code(201);
  }
};

export const get = {
  handler: request => {
    if (!request.payload || !request.payload.collectionId) {
      return Boom.badData('Collection ID is required');
    }

    const { collectionId } = request.payload;
    const gameCollection = GameCollection.findOne({
      _id: mongoose.Types.ObjectId(collectionId)
    });

    return {
      gameCollection
    };
  }
};
