import axios from 'axios';
import Boom from 'boom';
import Joi from 'joi';
import igdb from 'igdb-api-node';
import Game from './model';
import Company from '../company/model';
import Platform from '../platform/model';
import seedData from '../../data/platform-igdb-seed.json';

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

export const igdbTest = {
  handler: async request => {
    const { payload } = request;

    // *****************************************

    // Snippet to load platforms in from file

    // let gamesToImport = [];

    // for (const platform of seedData) {
    //   const { name, id, logo, games } = platform;
    //   const created = await Platform.create({
    //     igdbId: id,
    //     name,
    //     logo
    //     // games
    //   });
    //   gamesToImport = gamesToImport.concat(games);
    // }
    // console.log('Games to import length', gamesToImport.length);

    // return 'hi';

    // *****************************************

    // TODO: This is very bad don't leave it here
    // const client = igdb('761e2739f15afa61ff4a19d6b624ede0');

    // ****** GAME FIELDS *****

    const fields = [
      'id',
      'name',
      'summary',
      'first_release_date',
      'cover',
      'developers',
      'publishers',
      'platforms'
    ].join(',');

    // console.log(fields);

    // const igdbResponse = await client.scrollAll(
    //   `/games/?fields=${fields}&limit=50`,
    //   { pageLimit: 3 }
    // );

    const getPage = async nextPage => {
      const page = await axios.get(nextPage, {
        headers: {
          'user-key': '761e2739f15afa61ff4a19d6b624ede0' // TODO: Don't leave this here
        }
      });

      return page;
    };

    const buildNextPage = pageUrl => `https://api-endpoint.igdb.com${pageUrl}`;
    const pageSize = 50;

    const firstPage = await getPage(
      `https://api-endpoint.igdb.com/platforms/?fields=id,name,summary,games&limit=${pageSize}&scroll=1`
    );

    const totalResults = firstPage.headers['x-count'];
    const nextPage = buildNextPage(firstPage.headers['x-next-page']);
    const totalPages = Math.round(totalResults / pageSize);
    let platformData = firstPage.data;

    for (let i = 0; i < totalPages; i++) {
      const nextResult = await getPage(nextPage);
      platformData = platformData.concat(nextResult.data);
    }

    return platformData;

    // Pull down platforms you need, get game lists, pull down games, make seed file

    // why doesn't await work for this

    // const igdbResponse = await client.scrollAll(
    //   '/platforms/?fields=id,name,summary,games&limit=50'
    // );

    // const platforms = [
    //   'Game Boy Advance',
    //   'GameCube',
    //   'NES',
    //   'Nintendo 3DS',
    //   'Nintendo 64',
    //   'Nintendo DS',
    //   'Nintendo Switch',
    //   'PlayStation',
    //   'PlayStation 2',
    //   'PlayStation 3',
    //   'PlayStation 4',
    //   'PlayStation Portable',
    //   'PlayStation Vita',
    //   'Sega Dreamcast',
    //   'Sega Genesis',
    //   'Super Nintendo',
    //   'Wii',
    //   'Wii U',
    //   'Xbox',
    //   'Xbox 360',
    //   'Xbox One'
    // ];

    // const igdbResponse = await client.platforms({
    //   // search: 'god of war',
    //   filters: {
    //     'name.in': platforms.join(',')
    //   },
    //   fields: '*', // Return all fields
    //   limit: 50,
    //   offset: 50 // Index offset for results
    // });

    // for (let game of igdbResponse.body) {
    //   const { id, name, first_release_date, summary } = game;

    //   // Some fields aren't included in responses for certain games
    //   // TODO: Make a method that builds a game object from a response and includes required fields?
    //   const developers = game.developers || [];
    //   const publishers = game.publishers || [];
    //   const cover = game.cover || [];
    //   const platforms = game.platforms || [];

    //   const localCacheGame = {
    //     igdbId: id,
    //     title: name,
    //     description: summary,
    //     releaseDate: first_release_date,
    //     cover: {
    //       url: cover.url,
    //       width: cover.width,
    //       height: cover.height
    //     },
    //     developer: [],
    //     publisher: [],
    //     platform: platforms[0] // TODO: DO the same iteration stuff for platforms
    //   };

    //   console.log(game);

    // Here's where we're at. The stuff below works! Technically. It's a lot of requests and kinda sucks, but it works.
    // We could do expand requests, but we're limited by plan and we don't have a way of checking if we already have the
    // company locally before we make the request

    // Is this actually a problem? Maybe. Long tail, probably not. We'd likely have many of the publishers in our DB already,
    // which is good. The number of these requests we'd have to make would be much smaller then. Initially? Yep. Every request
    // will trigger this logic, and we'll need to pull down a ton of shit.

    // Any way to do this so that I can just cron a ton of them and do a mass import from the API?

    // // HEY. HOW DO WE STOP DUPLICATES FROM COMING IN HERE?
    // const returnedCompanies = developers.concat(publishers);

    // // This whole process is *rough*. How do we do it better?
    // let companiesInDb = await Company.find({
    //   igdbId: { $in: returnedCompanies }
    // });

    // companiesInDb = companiesInDb.reduce((accumulator, company) => {
    //   accumulator[company.igdbId] = company;
    //   return accumulator;
    // }, {});

    // let missingCompanyIds = returnedCompanies.map(company => {
    //   return !companiesInDb[company];
    // });

    // if (missingCompanyIds.length) {
    //   const missingCompanyData = await client.companies({
    //     ids: missingCompanyIds
    //   });

    //   missingCompanyData.forEach(async company => {
    //     console.log(company);

    //     const createdCompany = await Company.create({
    //       igdbId: company.id
    //     });
    //   });
    // }

    // // developers is array of ids
    // // check to see if you have developer ref in memory
    // // check to see if developer is in db
    // // if yes, pull ref, put in memory
    // // if no, insert into db and pull ref

    // for (let developer in developers) {
    //   let developerId;
    //   const retrievedCompany = companiesInDb[developers[developer]];
    //   if (!retrievedCompany) {
    //     const createdDeveloper = await Company.create({
    //       igdbId: developers[developer]
    //     });
    //     developerId = createdDeveloper._id;
    //   } else {
    //     developerId = retrievedCompany._id;
    //   }

    //   localCacheGame.developer.push(developerId);
    // }

    // // publishers is array of ids
    // // check to see if you have publisher ref in memory
    // // check to see if publisher is in db
    // // if yes, pull ref, put in memory
    // // if no, insert into db and pull ref

    // for (let publisher in publishers) {
    //   let publisherId;
    //   const igdbId = publishers[publisher];
    //   const retrievedCompany = companiesInDb[igdbId];
    //   if (!retrievedCompany) {
    //     const createdDeveloper = await Company.create({
    //       igdbId: igdbId
    //     });
    //     publisherId = createdDeveloper._id;
    //   } else {
    //     publisherId = retrievedCompany._id;
    //   }

    //   localCacheGame.publisher.push(publisherId);
    // }

    // // platforms is array of ids
    // // check to see if you have platform ref in memory
    // // check to see if platform is in db
    // // if yes, pull ref, put in memory
    // // if no, insert into db and pull ref

    // const createdGame = await Game.create(localCacheGame);
    // }

    // return igdbResponse.body;
  }
};
