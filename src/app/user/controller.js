import Joi from 'joi';
import Boom from 'boom';
import User from './model';
import { hashPassword, getToken, verifyCredentials } from './helpers';

const userJoiSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().required(),
  email: Joi.string().email(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});

export const getList = {
  handler: async request => {
    const { query } = request;

    const users = await User.find(query);

    return {
      users
    };
  }
};

export const post = {
  handler: async (request, h) => {
    const { email, username, password, firstName, lastName } = request.payload;
    const userData = {
      email,
      username,
      firstName,
      lastName
    };
    let validatedUserData = Joi.validate(
      { ...userData, password },
      userJoiSchema
    );

    if (validatedUserData.error) {
      // TODO: Add better way of handling validation issues on save.
      // This only returns the first of potentially several errors
      return Boom.badData(validatedUserData.error.details[0].message);
    }

    // Check if the user already exists
    const existingUser = await User.find({ email });
    if (existingUser.length) {
      return Boom.badRequest('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ ...userData, password: hashedPassword });

    return h
      .response({
        user: {
          token: getToken(user.id),
          ...userData
        }
      })
      .code(201);
  }
};

export const login = {
  handler: async request => {
    const user = await verifyCredentials(request);

    if (!user || user.error) {
      return Boom.unauthorized('Invalid credentials');
    }

    const responseUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      token: getToken(user.id)
    };

    return {
      user: responseUser
    };
  }
};
