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
      if (!user || user.error) {
        return h
          .response({
            error: 'Invalid credentials'
          })
          .code(401);
      }

      const responseUser = {
        id: user.dataValues.id,
        email: user.dataValues.email,
        username: user.dataValues.username,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        admin: user.dataValues.admin,
        token: getToken(user.dataValues.id)
      };

      return h
        .response({
          user: responseUser
        })
        .code(200);
    });
  }
};

export default login;
