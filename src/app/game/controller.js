import Boom from 'boom';
import Joi from 'joi';
import Game from './model';

const gameJoiSchema = Joi.object().keys({
  title: Joi.string()
    .min(2)
    .required(),
  developer: Joi.string(),
  publisher: Joi.string(),
  platform: Joi.string().required(),
  releaseDate: Joi.date(),
  description: Joi.string()
});

export const getList = {
  handler: async request => {
    const { query } = request;

    const games = await Game.find(query);

    return {
      games
    };
  }
};

export const put = {
  handler: async (request, h) => {
    const { payload } = request;

    const whitelistedData = {
      title: payload.title,
      developer: payload.developer,
      publisher: payload.publisher,
      platform: payload.platform,
      releaseDate: payload.releaseDate,
      description: payload.description
    };

    let validatedGameData = Joi.validate(whitelistedData, gameJoiSchema);

    if (validatedGameData.error) {
      // TODO: Add better way of handling validation issues on save.
      // This only returns the first of potentially several errors
      return Boom.badData(validatedGameData.error.details[0].message);
    }

    // Check if the user already exists
    const existingGame = await Game.find({
      title: whitelistedData.title,
      platform: whitelistedData.platform
    });

    if (existingGame.length) {
      return Boom.badRequest('Game already exists');
    }

    const game = await Game.create(whitelistedData);

    return h
      .response({
        game
      })
      .code(201);
  }
};
