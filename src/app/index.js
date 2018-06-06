import { default as userRoutes } from './user/router';
import { default as gameRoutes } from './game/router';

export default [...userRoutes, ...gameRoutes];
