import { getList, put, login } from './controller';

const routes = [
  {
    path: '/api/users',
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
    path: '/api/users',
    method: 'PUT',
    options: {
      log: {
        collect: true
      },
      cors: {
        origin: ['*'],
        credentials: true
      },
      auth: false
    },
    ...put
  },
  {
    path: '/api/users/login',
    method: 'POST',
    options: {
      log: { collect: true },
      cors: {
        origin: ['*'],
        credentials: true
      },
      auth: false
    },
    ...login
  }
];

export default routes;
