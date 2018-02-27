import { combineReducers } from 'redux';
import { singer } from './list';
import history from './history';
import * as player from './player';
import * as fromList from './list';
import * as fromHistory from './history';

export default combineReducers({
    singer,
    // list,
    history,
    ...player
})

export const getSinger = (state) => {
    return fromList.getSinger(state.singer)
}

export const getSearchHistory = (state) => {
    return fromHistory.getSearchHistory(state.history)
}