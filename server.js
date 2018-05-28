import Hapi from "hapi";
import { graphqlHapi, graphiqlHapi } from "apollo-server-hapi";
import schema from "./data/schema";
import db from "./data/db/connection";
import models from "./models";

const HOST = "localhost";
const PORT = 3000;

const server = new Hapi.server({
  host: HOST,
  port: PORT
});

server.route({
  method: "POST",
  path: "/api/users",
  options: {
    log: {
      collect: true
    }
  },
  handler: async (request, h) => {
    const { email, username, password, firstName, lastName } = request.payload;
    const userResponse = await models.User.findOrCreate({
      where: {
        email,
        username,
        password,
        firstName,
        lastName
      }
    }) // necessary to use spread to find out if user was found or created
      .spread(function(userResult, created) {
        if (created) {
          return h.response(userResult).code(201);
        } else {
          return h
            .response({
              error: "Malformed request"
            })
            .code("400");
        }
      });
    return userResponse;
  }
});

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

  try {
    await server.start();
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`);
  }

  console.log(`Server running at: ${server.info.uri}`);
};

StartServer();
