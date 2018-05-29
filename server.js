import Hapi from "hapi";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { graphqlHapi, graphiqlHapi } from "apollo-server-hapi";
import hapiAuthJwt from "hapi-auth-jwt2";
import schema from "./data/schema";
import db from "./data/db/connection";
import models from "./models";

const HOST = "localhost";
const PORT = 3000;
const secretKey = "NeverShareYourSecret"; // TODO: Generate keys and store them in a proper spot

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

const getToken = id => {
  return jwt.sign(
    {
      id: id
    },
    secretKey,
    { expiresIn: "7d" }
  );
};

const server = new Hapi.server({
  host: HOST,
  port: PORT
});

server.route({
  method: "GET",
  path: "/authtest",
  handler: async (request, h) => {
    return "works!";
  }
});

server.route({
  method: "POST",
  path: "/api/users",
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
    const validatedUserData = Joi.validate(userData, userJoiSchema);

    if (validatedUserData.error) {
      return h
        .response({
          error: validatedUserData.error
        })
        .code(400);
    }

    const userResponse = await models.User.findOrCreate({
      where: validatedUserData.value
    }) // necessary to use spread to find out if user was found or created
      .spread(function(userResult, created) {
        if (created) {
          return h
            .response({
              token: getToken(userResult.id),
              user: userResult
            })
            .code(201);
        } else {
          return h
            .response({
              error: "User already exists"
            })
            .code(400);
        }
      });
    return userResponse;
  }
});

server.route({
  method: "GET",
  path: "/api/login",
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
    const validatedUserData = Joi.validate(userData, userJoiSchema);

    if (validatedUserData.error) {
      return h
        .response({
          error: validatedUserData.error
        })
        .code(400);
    }

    const userResponse = await models.User.findOrCreate({
      where: validatedUserData.value
    }) // necessary to use spread to find out if user was found or created
      .spread(function(userResult, created) {
        if (created) {
          return h.response(userResult).code(201);
        } else {
          return h
            .response({
              error: "User already exists"
            })
            .code(400);
        }
      });
    return userResponse;
  }
});

const validate = async function(decoded, request) {
  // do your checks to see if the person is valid
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

  await server.register(hapiAuthJwt);

  server.auth.strategy("jwt", "jwt", {
    key: secretKey, // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ["HS256"] } // pick a strong algorithm
  });

  server.auth.default("jwt");

  try {
    await server.start();
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`);
  }

  console.log(`Server running at: ${server.info.uri}`);
};

StartServer();
