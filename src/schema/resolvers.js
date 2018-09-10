import merge from 'lodash/merge';

import user from './user/user.resolver';
import game from './game/game.resolver';

export default merge(user, game);
