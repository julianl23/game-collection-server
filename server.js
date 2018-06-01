import Hapi from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import hapiAuthJwt from 'hapi-auth-jwt2';
import schema from './data/schema';
import models from './models';
import * as routes from './routes';

const HOST = 'localhost';
const PORT = 3000;
const secretKey = 'NeverShareYourSecret'; // TODO: Generate keys and store them in a proper spot

const server = new Hapi.server({
  host: HOST,
  port: PORT,
  debug: { request: ['error'] }
});

Object.keys(routes).forEach(route => {
  server.route(routes[route]);
});

const validate = async function(decoded) {
  if (!models.User.findById(decoded.id)) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

const StartServer = async () => {
  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema: schema
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
        cors: true
      },
      graphiqlOptions: {
        endpointURL: '/graphql'
      }
    }
  });

  await server.register(hapiAuthJwt);

  server.auth.strategy('jwt', 'jwt', {
    key: secretKey, // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
  });

  server.auth.default('jwt');

  try {
    await server.start();
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`);
  }

  console.log(`Server running at: ${server.info.uri}`);
};

StartServer();
