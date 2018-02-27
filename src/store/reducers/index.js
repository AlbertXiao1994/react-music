import { combineReducers } from 'redux';
import list from './list';
import history from './history';
import * as player from './player';
import * as fromList from './list';
import * as fromHistory from './history';

export default combineReducers({
    list,
    history,
    ...player
})

export const getSinger = (state) => {
    return fromList.getSinger(state.list)
}

export const getSearchHistory = (state) => {
    return fromHistory.getSearchHistory(state.history)
}

export const getFavoriteList = (state) => {
    return fromHistory.getFavoriteList(state.history)
}

export const getPlayHistory = (state) => {
    return fromHistory.getPlayHistory(state.history)
}