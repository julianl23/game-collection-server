import { getList, put, igdbTest } from './controller';

const routes = [
  {
    path: '/api/games',
    method: 'GET',
    options: {
      log: {
        collect: true
      },
      auth: false
    },
    ...getList
  },
  {
    path: '/api/games',
    method: 'PUT',
    options: {
      auth: false
    },
    ...put
  },
  {
    path: '/api/games/igdbTest',
    method: 'GET',
    options: {
      log: {
        collect: false
      },
      auth: false
    },
    ...igdbTest
  }
];

export default routes;
