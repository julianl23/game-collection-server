import elasticsearch from 'elasticsearch';
import '../env';
import setupMongoose, { disconnectMongoose } from '../config/mongoose';
import Game from '../app/game/model';
// Need to import these to ensure they're initialized by mongoose
import GameMode from '../app/game_mode/model'; // eslint-disable-line no-unused-vars
import Company from '../app/company/model'; // eslint-disable-line no-unused-vars
import Platform from '../app/platform/model'; // eslint-disable-line no-unused-vars

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

const indexGames = async () => {
  const count = await Game.count();
  let indexesToPush = [];
  const pageSize = 100;
  const pageCount = Math.round(count / pageSize);
  let currentPage;

  const buildIndexes = async list => {
    for (let game of list) {
      indexesToPush.push({
        create: {
          _index: 'game',
          _type: 'game',
          _id: game._id.toString()
        }
      });
      indexesToPush.push({
        igdbId: game.igdbId,
        title: game.title,
        developer: game.developer,
        publisher: game.publisher,
        platforms: game.platforms,
        releaseDate: game.releaseData,
        description: game.description,
        cover: game.cover,
        gameModes: game.gameModes,
        multiplayerModes: game.multiplayerModes
      });
    }

    await client.bulk({
      body: indexesToPush
    });

    indexesToPush = [];
  };

  for (let i = 0; i < pageCount; i++) {
    console.time('Find and index page'); // eslint-disable-line no-console
    currentPage = i;
    const games = await Game.find({})
      .skip(currentPage * pageSize)
      .populate('developer')
      .populate('publisher')
      .populate('platforms')
      .populate('gameModes')
      .populate('multiplayerModes')
      .limit(pageSize);

    await buildIndexes(games);
    console.timeEnd('Find and index page'); // eslint-disable-line no-console
    console.log('Indexed page ', i + 1); // eslint-disable-line no-console
  }
};

const runScript = async () => {
  try {
    await setupMongoose();
    await indexGames();

    await disconnectMongoose();
  } catch (e) {
    return e;
  }
};

runScript();
