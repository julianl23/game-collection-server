import Joi from 'joi';
import { userJoiSchema } from '../schemas';
import { getToken, hashPassword } from '../helpers';
import models from '../../../../models';

const post = {
  method: 'POST',
  path: '/api/users',
  options: {
    log: {
      collect: true
    },
    auth: false
  },
  handler: async (request, h) => {
    const { email, username, password, firstName, lastName } = request.payload;
    const userData = {
      email,
      username,
      password,
      firstName,
      lastName
    };
    let validatedUserData = Joi.validate(userData, userJoiSchema);

    if (validatedUserData.error) {
      return h
        .response({
          error: validatedUserData.error
        })
        .code(400);
    }

    let hashedPasswordPromise = hashPassword(userData.password);
    return hashedPasswordPromise.then(async hashedPassword => {
      userData.password = hashedPassword;

      const userResponse = await models.User.findOrCreate({
        where: userData
      }) // necessary to use spread to find out if user was found or created
        .spread(function(userResult, created) {
          if (created) {
            delete userData.password;
            return h
              .response({
                // token: getToken(userResult.id),
                user: {
                  token: getToken(userResult.id),
                  ...userData
                }
              })
              .code(201);
          } else {
            return h
              .response({
                error: 'User already exists'
              })
              .code(400);
          }
        });
      return userResponse;
    });
  }
};

export default post;
