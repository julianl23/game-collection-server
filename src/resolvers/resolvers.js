import mongoose from 'mongoose';
import { Prisma } from 'prisma-binding';
import Game from '../app/game/model';
import User from '../app/user/model';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466' // TODO: This would have to be changed to an env variable
});

const resolvers = {
  Query: {
    async games(root, args) {
      const { query } = args;
      return await Game.search({ q: query });
    },
    async game(root, args) {
      const { _id } = args;
      return await Game.findOne({ _id: mongoose.Types.ObjectId(_id) });
    },
    async user(root, args) {
      // const { _id } = args;
      // return await User.findOne({ _id: mongoose.Types.ObjectId(_id) });

      // TODO: Write actual code to retreive a single user
      const users = await prisma.query.users(null, '{ id name }');
      console.log(users);
      return null;
      // return users;
    },
    async currentUser(root, args, context) {
      const contextUser = context.user;

      if (contextUser) {
        const currentUser = await User.findOne({
          _id: mongoose.Types.ObjectId(contextUser._id)
        }).populate('gameCollection');

        return currentUser;
      } else {
        return null;
      }
    }
  },
  Mutation: {
    async AddGameToCollection(root, args, context) {
      const contextUser = context.user;
      const gameId = args.input._id;
      const {
        platform,
        note,
        borrowed,
        borrowedDate,
        cost,
        details
      } = args.input;

      const currentUser = await User.findOne({
        _id: mongoose.Types.ObjectId(contextUser._id)
      }).populate('gameCollection');

      const game = Game.findOne({ _id: mongoose.Types.ObjectId(gameId) });
      if (!game) {
        return null;
      }

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

      currentUser.gameCollection.items.push(collectionItem);
      currentUser.gameCollection.save();

      return gameId;
    }
  }
};

export default resolvers;
