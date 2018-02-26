import * as types from './action-types';
import { saveSearch, clearSearch, deleteSearch } from 'common/js/cache';

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

