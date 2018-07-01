import elasticsearch from 'elasticsearch';
import '../env';
import setupMongoose, { disconnectMongoose } from '../config/mongoose';
import Game from '../app/game/model';

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
        // create: {
        // _index: 'game',
        // _type: 'game',
        // _id: game._id.toString(),
        // body: {
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
        // }
        // }
      });
    }

    await client.bulk({
      body: indexesToPush
    });

    indexesToPush = [];
  };

  for (let i = 0; i < pageCount; i++) {
    console.time('Find and index page');
    currentPage = i;
    const games = await Game.find({})
      .skip(currentPage * pageSize)
      .limit(pageSize);

    await buildIndexes(games);
    console.timeEnd('Find and index page');
    console.log('Indexed page ', i + 1);
  }
};

const runScript = async () => {
  await setupMongoose();
  await indexGames();
  await disconnectMongoose();
};

runScript();