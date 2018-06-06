import { getList, put } from './controller';

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
      log: {
        collect: true
      },
      auth: false
    },
    ...post
  }
];

export default routes;
