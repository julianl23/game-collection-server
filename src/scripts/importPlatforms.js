import Platform from '../app/platform/model';
import seedData from '../data/platform-igdb-seed.json';

const importPlatforms = async () => {
  let gamesToImport = [];

  for (const platform of seedData) {
    // seedData.forEach(async platform => {
    const { name, id, logo, games } = platform;
    const created = await Platform.create({
      igdbId: id,
      name,
      logo
      // games
    });
    gamesToImport = gamesToImport.concat(games);
    // });
  }

  console.log('gamesToImport', gamesToImport.length);
};

importPlatforms();
