import { verifyCredentials, getToken } from '../helpers';

const login = {
  method: 'POST',
  path: '/api/users/login',
  options: {
    log: {
      collect: true
    },
    auth: false
  },
  handler: async (request, h) => {
    const userPromise = verifyCredentials(request);

    return userPromise.then(async user => {
      if (!user) {
        return h
          .response({
            error: 'Could not find user with provided email'
          })
          .code(401);
      }

      if (user.error) {
        return h
          .response({
            error: 'Invalid credentials'
          })
          .code(401);
      }

      return h
        .response({
          user: {
            ...user.dataValues,
            token: getToken(user.id)
          }
        })
        .code(200);
    });
  }
};

export default login;
