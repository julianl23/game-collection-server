import { getList, post, login } from './controller';

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
    method: 'POST',
    options: {
      log: {
        collect: true
      },
      auth: false
    },
    ...post
  },
  {
    path: '/api/users/login',
    method: 'POST',
    options: {
      log: { collect: true },
      auth: false
    },
    ...login
  }
];

export default routes;
