import mongoose from 'mongoose';
import { ApolloError, AuthenticationError } from 'apollo-server';

import Game from '../../app/game/model';
import User from '../../app/user/model';
import GameCollection from '../../app/game_collection/model';

export default {
  Query: {
    async games(root, args, context) {
      const { query, size = 20, from = 0 } = args;

      const contextUser = context.user;
      let results = await Game.search({ q: query, size, from });

      if (contextUser) {
        let currentUser = await User.findOne({
          _id: mongoose.Types.ObjectId(contextUser._id)
        })
          .populate('gameCollection')
          .populate('items');

        const collection = currentUser.gameCollection.items;
        const collectionIds = collection.map(item => {
          return item.game._id.toString();
        });

        results.forEach(resultItem => {
          resultItem.inCollection = collectionIds.includes(resultItem._id);
        });
      }

      console.log('i am reasults', results);

      return results;
    },
    async game(root, args) {
      const { _id } = args;
      return await Game.findOne({ _id: mongoose.Types.ObjectId(_id) });
    }
  },
  Mutation: {
    AddGameToCollection: async function(root, args, context) {
      const contextUser = context.user;
      let currentUser;

      if (contextUser) {
        currentUser = await User.findOne({
          _id: mongoose.Types.ObjectId(contextUser._id)
        });
      } else {
        return AuthenticationError('User not authenticated');
      }

      try {
        return await GameCollection.addGame(
          currentUser.gameCollection,
          args.input
        );
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    }
  }
};
