import { default as userRoutes } from './user/router';
import { default as gameRoutes } from './game/router';
import { default as gameCollectionRoutes } from './game_collection/router';

export default [...userRoutes, ...gameRoutes, ...gameCollectionRoutes];
