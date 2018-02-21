import { combineReducers } from 'redux';
import * as list from './list';
import * as history from './history';
import * as player from './player';

export default combineReducers({
    ...list,
    ...history,
    ...player
})