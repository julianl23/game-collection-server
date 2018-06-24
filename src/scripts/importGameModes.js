import igdb from 'igdb-api-node';
import '../env';
import setupMongoose from '../config/mongoose';
import GameMode from '../app/game_mode/model';

const client = igdb(process.env.IGDB_KEY);

const importGameModes = async () => {
  const modeFields = ['id', 'name'].join(',');

  const modes = await client.game_modes({
    fields: modeFields
  });

  await modes.body.forEach(async mode => {
    await GameMode.create({
      igdbId: mode.id,
      name: mode.name
    });
  });

  return 'Completed import';
};

setupMongoose();
importGameModes();
