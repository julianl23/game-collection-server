import mongoose from 'mongoose';

import Game from '../../app/game/model';

export default {
  Query: {
    async games(root, args) {
      const { query, size = 20, from = 0 } = args;
      return await Game.search({ q: query, size, from });
    },
    async game(root, args) {
      const { _id } = args;
      return await Game.findOne({ _id: mongoose.Types.ObjectId(_id) });
    }
  },
  Mutation: {
    async AddGameToCollection() {
      // async AddGameToCollection(root, args) {
      // const gameId = args.input._id;
      // const {
      //   platform,
      //   note,
      //   borrowed,
      //   borrowedDate,
      //   cost,
      //   details
      // } = args.input;
      // // TODO: Create config layer for getting api urls
      // const addResult = await axios.put('http://localhost:3000/api/users', {
      //   id: gameId,
      //   platform,
      //   note,
      //   borrowed,
      //   borrowedDate,
      //   cost,
      //   details
      // });
      // // console.log(addResult);
      // return addResult.data.game;
    }
  }
};
