import { get, addGame } from './controller';

const routes = [
  {
    path: '/api/collection',
    method: 'GET',
    options: {
      log: {
        collect: true
      },
      auth: false
    },
    ...get
  },
  {
    path: '/api/collection/add',
    method: 'PUT',
    options: {
      log: {
        collect: true
      }
    },
    ...addGame
  }
];

export default routes;
