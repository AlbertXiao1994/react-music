import { combineReducers } from 'redux';
import list from './list';
import history from './history';
import player from './player';

export default combineReducers({
    list,
    history,
    player
})