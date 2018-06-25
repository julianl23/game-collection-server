import axios from 'axios';
import winston from 'winston';
import '../env';
import setupMongoose, { disconnectMongoose } from '../config/mongoose';
import Game from '../app/game/model';
import Platform from '../app/platform/model';
import Company from '../app/company/model';
import GameMode from '../app/game_mode/model';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

const buildNextPage = pageUrl => `https://api-endpoint.igdb.com${pageUrl}`;

const getPage = async nextPage => {
  const page = await axios.get(nextPage, {
    headers: {
      'user-key': process.env.IGDB_KEY,
      accept: 'application/json'
    }
  });

  return page;
};

const retrieveCompany = async company => {
  const igdbId = company.id;
  let retrievedCompany = await Company.findOne({ igdbId });
  if (!retrievedCompany) {
    retrievedCompany = await Company.create({
      igdbId: company.id,
      name: company.name,
      description: company.description
    });
  }

  return retrievedCompany;
};

const createGamesFromData = async (data, pageNumber) => {
  logger.info(`*****starting page import: ${pageNumber}`);
  for (let game of data) {
    let gameDeveloper = game.developers
      ? await retrieveCompany(game.developers[0])
      : {};

    let gamePublisher = game.publishers
      ? await retrieveCompany(game.publishers[0])
      : {};

    const platformRefs = [];
    const gameModeRefs = [];
    const multiplayerModes = [];

    if (game.platforms) {
      for (let platform of game.platforms) {
        try {
          const retrievedPlatform = await Platform.findOne({
            igdbId: platform
          });
          platformRefs.push(retrievedPlatform._id);
        } catch (e) {
          logger.error(e);
        }
      }
    }

    if (game.game_modes) {
      for (let mode of game.game_modes) {
        try {
          const retrievedMode = await GameMode.findOne({ igdbId: mode });
          gameModeRefs.push(retrievedMode._id);
        } catch (e) {
          logger.error(e);
        }
      }
    }

    if (game.multiplayer_modes) {
      for (let multiplayerMode of game.multiplayer_modes) {
        try {
          let modeToPush = multiplayerMode;

          if (modeToPush.platform) {
            const platform = await Platform.findOne({
              igdbId: multiplayerMode.platform
            });

            modeToPush.platform = platform._id;
          }

          multiplayerModes.push(modeToPush);
        } catch (e) {
          logger.error(e);
        }
      }
    }

    try {
      const createdGame = await Game.create({
        igdbId: game.id,
        title: game.name,
        description: game.summary,
        releaseDate: game.first_release_date,
        cover: game.cover,
        developer: gameDeveloper._id,
        publisher: gamePublisher._id,
        platforms: platformRefs,
        gameModes: gameModeRefs,
        multiplayerModes: multiplayerModes.length ? multiplayerModes : null
      });

      if (Object.keys(gameDeveloper).length) {
        await gameDeveloper.update({ $push: { developed: createdGame._id } });
      }

      if (Object.keys(gamePublisher).length) {
        await gamePublisher.update({ $push: { published: createdGame._id } });
      }
    } catch (e) {
      logger.error(e);
    }
  }

  logger.info(`*****page import complete: ${pageNumber}`);
  return;
};

const importGames = async () => {
  const platformList =
    '24,33,13,46,9,11,37,48,8,38,23,5,49,19,32,12,22,35,4,18,7,41,64,20,21';

  const gameFields = [
    'id',
    'name',
    'summary',
    'first_release_date',
    'cover',
    'developers',
    'publishers',
    'platforms',
    'game_modes',
    'multiplayer_modes',
    'developers.name',
    'developers.description',
    'publishers.name',
    'publishers.description'
  ].join(',');

  const pageSize = 50;
  const filterType = 'not_in'; // this can be 'any' or 'not_in'

  const firstPage = await getPage(
    `https://api-endpoint.igdb.com/games/?fields=${gameFields}&filter[release_dates.platform][${filterType}]=${platformList}&limit=${pageSize}&scroll=1&expand=developers,publishers`
  );

  console.time('page import'); // eslint-disable-line no-console
  await createGamesFromData(firstPage.data, 1);
  console.timeEnd('page import'); // eslint-disable-line no-console

  const totalResults = firstPage.headers['x-count'];
  logger.info(`total results: ${totalResults}`);
  const totalPages = Math.round(totalResults / pageSize);
  logger.info(`***total pages: ${totalPages}`);
  const nextPage = buildNextPage(firstPage.headers['x-next-page']);

  // Start at page 2, pull the rest of the pages down
  for (let i = 1; i < totalPages; i++) {
    console.time('page import'); // eslint-disable-line no-console
    const nextResult = await getPage(nextPage);
    await createGamesFromData(nextResult.data, i + 1);
    console.timeEnd('page import'); // eslint-disable-line no-console
  }

  logger.info('Completed import');
  return 'Completed import';
};

const runScript = async () => {
  await setupMongoose();
  await importGames();
  await disconnectMongoose();
};

runScript();
