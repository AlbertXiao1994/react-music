import * as types from './action-types';
import { saveSearch, clearSearch, deleteSearch } from 'common/js/cache';
import { savePlay, saveFavorite, deleteFavorite } from 'common/js/cache';

const receiveSinger = (singer) => {
    return {
        type: types.SET_SINGER,
        singer
    }
}

const receiveSearchHistory = (searchHistory) => {
    return {
        type: types.SET_SEARCH_HISTORY,
        searchHistory
    }
}

const receivePlayHistory = (playHistory) => {
    return {
        type: types.SET_PLAY_HISTORY,
        playHistory
    }
}

const receiveFavoriteList = (favoriteList) => {
    return {
        type: types.SET_FAVORITE_LIST,
        favoriteList
    }
}

export const setSinger = (singer) => dispatch => {
    dispatch(receiveSinger(singer))
}

export const saveSearchHistory = (query) => dispatch => {
    let searchHistory = saveSearch(query)
    dispatch(receiveSearchHistory(searchHistory))
}

export const clearSearchHistory = () => dispatch => {
    let searchHistory = clearSearch()
    dispatch(receiveSearchHistory(searchHistory))
}

export const deleteSearchHistory = (query) => dispatch => {
    let searchHistory = deleteSearch(query)
    dispatch(receiveSearchHistory(searchHistory))
}

export const saveFavoriteList = (song) => dispatch => {
    let favoriteList = saveFavorite(song)
    dispatch(receiveFavoriteList(favoriteList))
}

export const savePlayHistory = (song) => dispatch => {
    let playHistory = savePlay(song)
    dispatch(receivePlayHistory(playHistory))
}

export const deleteFavoriteList = (song) => dispatch => {
    let favoriteList = deleteFavorite(song)
    dispatch(receiveFavoriteList(favoriteList))
}

