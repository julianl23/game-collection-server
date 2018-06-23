import igdb from 'igdb-api-node';
import setupMongoose from '../config/mongoose';
import GameMode from '../app/game_mode/model';

const client = igdb('761e2739f15afa61ff4a19d6b624ede0'); // TODO: Don't leave this here

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
