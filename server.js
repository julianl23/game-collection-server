import Hapi from "hapi";
import { graphqlHapi, graphiqlHapi } from "apollo-server-hapi";
import schema from "./data/schema";

const HOST = "localhost";
const PORT = 3000;

const server = new Hapi.server({
  host: HOST,
  port: PORT
});

// server.route({
//   method: "GET",
//   path: "/",
//   handler: (request, h) => {
//     return "Hello, world!";
//   }
// });

// server.route({
//   method: "GET",
//   path: "/{name}",
//   handler: (request, h) => {
//     return "Hello, " + encodeURIComponent(request.params.name) + "!";
//   }
// });

const StartServer = async () => {
  await server.register({
    plugin: graphqlHapi,
    options: {
      path: "/graphql",
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
      path: "/graphiql",
      route: {
        cors: true
      },
      graphiqlOptions: {
        endpointURL: "/graphql"
      }
    }
  });

  // try {
  await server.start();
  // } catch (err) {
  //   console.log(`Error while starting server: ${err.message}`);
  // }

  console.log(`Server running at: ${server.info.uri}`);
};

StartServer();
