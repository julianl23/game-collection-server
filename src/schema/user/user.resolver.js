import mongoose from 'mongoose';

import User from '../../app/user/model';

export default {
  Query: {
    async user(root, args) {
      const { _id } = args;
      return await User.findOne({ _id: mongoose.Types.ObjectId(_id) });
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
  }
};
