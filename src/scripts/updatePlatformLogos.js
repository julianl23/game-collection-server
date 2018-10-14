import axios from 'axios';
import Platform from '../app/platform/model';
import '../env';
import setupMongoose from '../config/mongoose';

const getPage = async nextPage => {
  const page = await axios.get(nextPage, {
    headers: {
      'user-key': process.env.IGDB_KEY,
      accept: 'application/json'
    }
  });

  return page;
};

const buildNextPage = pageUrl => `https://api-endpoint.igdb.com${pageUrl}`;

const updateLogo = async gamePlatform => {
  const logo = gamePlatform.logo;

  if (logo) {
    console.log(
      'About to retrieve platform from DB with IGDB ID:',
      gamePlatform.id
    );

    try {
      const savedPlatform = await Platform.findOne({
        igdbId: gamePlatform.id
      });

      savedPlatform.logo = logo;
      await savedPlatform.save();
    } catch (e) {
      console.log(e);
    }
  }
};

const updatePlatformLogos = async () => {
  const pageSize = 50;

  const firstPage = await getPage(
    `https://api-endpoint.igdb.com/platforms/?fields=id,name,summary,games,logo&limit=${pageSize}&scroll=1`
  );

  const totalResults = firstPage.headers['x-count'];
  const nextPage = buildNextPage(firstPage.headers['x-next-page']);
  const totalPages = Math.round(totalResults / pageSize);

  console.log(`Received ${totalPages} pages of platforms`);

  for (let i = 0; i < totalPages; i++) {
    console.log(`Retrieving page ${i + 1}`);

    const nextResult = await getPage(nextPage);

    for (const gamePlatform of nextResult.data) {
      // const logo = gamePlatform.logo;

      // if (logo) {
      //   const savedPlatform = await Platform.find({
      //     igdbId: gamePlatform.id
      //   });

      //   console.log('this is the platform im gonna update', savedPlatform);

      //   savedPlatform.logo = logo;

      //   await savedPlatform.save();
      // }
      updateLogo(gamePlatform);
    }
  }

  return 'Done';
};

setupMongoose();
updatePlatformLogos();
