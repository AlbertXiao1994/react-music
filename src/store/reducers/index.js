import { combineReducers } from 'redux';
import list from './list';
import history from './history';
import player from './player';
import * as fromList from './list';
import * as fromHistory from './history';
import * as fromPlayer from './player';

export default combineReducers({
    list,
    history,
    player
})

export const getSinger = (state) => {
    return fromList.getSinger(state.list)
}

export const getDisc = (state) => {
    return fromList.getDisc(state.list)
}

export const getTopList = (state) => {
    return fromList.getTopList(state.list)
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

export const getPlayState = (state) => {
    return fromPlayer.getPlayState(state.player)
}

export const getFullScreen = (state) => {
    return fromPlayer.getFullScreen(state.player)
}

export const getPlayList = (state) => {
    return fromPlayer.getPlayList(state.player)
}

export const getSequenceList = (state) => {
    return fromPlayer.getSequenceList(state.player)
}

export const getPlayMode = (state) => {
    return fromPlayer.getPlayMode(state.player)
}

export const getCurrentIndex = (state) => {
    return fromPlayer.getCurrentIndex(state.player)
}