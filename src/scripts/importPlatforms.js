import axios from 'axios';
// import Platform from '../app/platform/model';
import { Prisma } from 'prisma-binding';

import '../env';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466' // TODO: This would have to be changed to an env variable
});

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

const importPlatforms = async () => {
  const pageSize = 50;

  const firstPage = await getPage(
    `https://api-endpoint.igdb.com/platforms/?fields=id,name,summary,games&limit=${pageSize}&scroll=1`
  );

  const totalResults = firstPage.headers['x-count'];
  const nextPage = buildNextPage(firstPage.headers['x-next-page']);
  const totalPages = Math.round(totalResults / pageSize);
  let platformData = firstPage.data.map(item => ({
    igdbId: item.id,
    name: item.name,
    logo: item.logo,
    igdbGameList: item.games
  }));

  try {
    for (let i = 0; i < totalPages; i++) {
      const nextResult = await getPage(nextPage);
      // const resultsWithCorrectedId = nextResult.data.map(item => ({
      //   igdbId: item.id,
      //   name: item.name,
      //   logo: item.logo,
      //   igdbGameList: item.games
      // }));

      for (const item of nextResult.data) {
        console.log('Inserting item: ', item.id);
        // const itemWithCorrectedId = {
        //   igdb_id: item.id,
        //   name: item.name,
        //   logo: item.logo,
        //   igdbGameList: item.games
        // };

        await prisma.mutation.createPlatform(
          {
            data: {
              igdb_id: item.id,
              name: item.name,
              logo: item.logo,
              igdbGameList: {
                set: item.games
              }
            }
          },
          '{ id }'
        );
      }

      // platformData = platformData.concat(resultsWithCorrectedId);
      platformData = platformData.concat(nextResult);
    }
  } catch (e) {
    throw e;
  }

  // await Platform.insertMany(platformData);

  return {
    message: `Added ${platformData.length} platforms`
  };
};

importPlatforms();
