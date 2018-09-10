import mongoose from 'mongoose';
import axios from 'axios';
import { ApolloError } from 'apollo-server';

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
  },
  Mutation: {
    async CreateUser(root, args) {
      const { email, username, password, firstName, lastName } = args.input;

      // TODO: Create config layer for getting api urls
      const createResult = await axios.put('http://localhost:3000/api/users', {
        email,
        username,
        password,
        firstName,
        lastName
      });

      if (createResult.status !== 201) {
        return new ApolloError('Could not create user', createResult.status);
      }

      return createResult.data.user;
    }
  }
};
