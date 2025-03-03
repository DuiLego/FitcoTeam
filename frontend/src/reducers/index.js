import { combineReducers } from 'redux';

import alert from './alert';
import loader from './loader';

import auth from './auth';
import home from './home';

export default combineReducers({
    alert, loader, auth, home
});