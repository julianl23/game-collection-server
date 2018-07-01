import Hapi from 'hapi';
import HapiPino from 'hapi-pino';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import hapiAuthJwt from 'hapi-auth-jwt2';
import mongoose from 'mongoose';
import routes from './app/index';
import setupMongoose from './config/mongoose';
import schema from './types/schema';
import User from './app/user/model';

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

setupMongoose();

const app = new Hapi.server({
  host: HOST,
  port: PORT,
  debug: { request: ['error'] }
});

const registerPino = async (server, options = {}) => {
  await server.register({
    plugin: HapiPino,
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      mergeHapiLogData: true,
      ...options
    }
  });
};

const registerGraphQL = async server => {
  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: async request => {
        return {
          schema: schema,
          context: { user: request.auth.credentials }
        };
      },
      route: {
        cors: true
      }
    }
  });

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      route: {
        cors: true,
        auth: false
      },
      graphiqlOptions: async request => {
        return {
          endpointURL: '/graphql',
          passHeader: `'Authorization': 'Bearer ${request.query.authorization}'`
        };
      }
    }
  });
};

const registerJWT = async server => {
  await server.register(hapiAuthJwt);

  // TODO: Re-implement this in mongo and move it elsewhere
  const validate = async function(decoded) {
    const response = { isValid: false };
    const validateUser = await User.findOne({
      _id: mongoose.Types.ObjectId(decoded.id)
    });
    if (validateUser) {
      response.isValid = true;
      response.credentials = validateUser;
    }

    return response;
  };

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
  });

  server.auth.default('jwt');
};

export const bootstrapApp = async () => {
  await registerPino(app);
  await registerJWT(app);
  await registerGraphQL(app);

  routes.forEach(route => {
    app.route(route);
  });

  return app;
};
