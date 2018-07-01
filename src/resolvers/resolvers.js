import mongoose from 'mongoose';
import Game from '../app/game/model';
import User from '../app/user/model';

// Examples from https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035?_ga=2.16070707.401638683.1527376000-1121082364.1527376000
// const resolvers = {
//   Query: {
//     author(root, args) {
//       return { id: 1, firstName: "Hello", lastName: "World" };
//     },
//     allAuthors() {
//       return [{ id: 1, firstName: "Hello", lastName: "World" }];
//     },
//     async games() {
//       return await models.Game.findAll();
//     }
//   },
//   Author: {
//     posts(author) {
//       return [
//         { id: 1, title: "A post", text: "Some text", views: 2 },
//         { id: 2, title: "Another post", text: "Some other text", views: 200 }
//       ];
//     }
//   },
//   Post: {
//     author(post) {
//       return { id: 1, firstName: "Hello", lastName: "World" };
//     }
//   }
// };

const resolvers = {
  Query: {
    async games(root, args) {
      const { query } = args;
      return await Game.search({ q: query });
    },
    async game(root, args) {
      const { id } = args;
      return await Game.findOne({ _id: mongoose.Types.ObjectId(id) });
    },
    async user(root, args) {
      const { id } = args;
      return await User.findOne({ _id: mongoose.Types.ObjectId(id) });
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
