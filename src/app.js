import Hapi from 'hapi';
import HapiPino from 'hapi-pino';
const { ApolloServer } = require('apollo-server-hapi');
import hapiAuthJwt from 'hapi-auth-jwt2';
import mongoose from 'mongoose';
import routes from './app/index';
import setupMongoose from './config/mongoose';
import { typeDefs, resolvers } from './schema';
import User from './app/user/model';

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

setupMongoose();

const app = new Hapi.server({
  host: HOST,
  port: PORT,
  debug: { request: ['error'] }
});

// TODO: This should ideally be a secure cookie, right?
app.state('token', {
  ttl: 30 * 24 * 60 * 60 * 1000, // expires in 30 days
  encoding: 'none', // we already used JWT to encode
  isSecure: false, // warm & fuzzy feelings
  isHttpOnly: false, // prevent client alteration
  clearInvalid: false, // remove invalid cookies
  strictHeader: true, // don't allow violations of RFC 6265
  path: '/' // set the cookie for all routes
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
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ request }) => {
      return { user: request.auth.credentials, request };
    }
  });

  await apolloServer.applyMiddleware({
    app: server,
    route: {
      cors: {
        credentials: true,
        origin: ['*']
      },
      auth: {
        mode: 'optional'
      }
    }
  });

  await apolloServer.installSubscriptionHandlers(server.listener);
};

const registerJWT = async server => {
  await server.register(hapiAuthJwt);

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
