import axios from 'axios';
import Platform from '../app/platform/model';

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

  for (let i = 0; i < totalPages; i++) {
    const nextResult = await getPage(nextPage);
    const resultsWithCorrectedId = nextResult.data.map(item => ({
      igdbId: item.id,
      name: item.name,
      logo: item.logo,
      igdbGameList: item.games
    }));
    platformData = platformData.concat(resultsWithCorrectedId);
  }

  await Platform.insertMany(platformData);

  return {
    message: `Added ${platformData.length} platforms`
  };
};

importPlatforms();
