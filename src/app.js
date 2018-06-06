import Hapi from 'hapi';
import HapiPino from 'hapi-pino';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import hapiAuthJwt from 'hapi-auth-jwt2';
import routes from './app/index';
import setupMongoose from './config/mongoose';
// import schema from './data/schema';

const HOST = 'localhost';
const PORT = 3000;
const secretKey = 'NeverShareYourSecret'; // TODO: Generate keys and store them in a proper spot

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

// const registerGraphQL = async server => {
//   await server.register({
//     plugin: graphqlHapi,
//     options: {
//       path: '/graphql',
//       graphqlOptions: {
//         schema: schema
//       },
//       route: {
//         cors: true,
//         auth: false
//       }
//     }
//   });

//   await server.register({
//     plugin: graphiqlHapi,
//     options: {
//       path: '/graphiql',
//       route: {
//         cors: true,
//         auth: false
//       },
//       graphiqlOptions: {
//         endpointURL: '/graphql'
//       }
//     }
//   });
// };

const registerJWT = async server => {
  await server.register(hapiAuthJwt);

  // TODO: Re-implement this in mongo and move it elsewhere
  // const validate = async function(decoded) {
  //   if (!models.User.findById(decoded.id)) {
  //     return { isValid: false };
  //   } else {
  //     return { isValid: true };
  //   }
  // };

  const validate = async () => {};

  server.auth.strategy('jwt', 'jwt', {
    key: secretKey, // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
  });
};

export const bootstrapApp = async () => {
  await registerPino(app);
  // await registerGraphQL(app);
  await registerJWT(app);

  routes.forEach(route => {
    app.route(route);
  });

  return app;
};