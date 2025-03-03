import { combineReducers } from 'redux';

import alert from './alert';

import auth from './auth';
import home from './home';

export default combineReducers({
    alert, auth, home
});