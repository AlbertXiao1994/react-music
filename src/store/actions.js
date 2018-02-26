import * as types from './action-types';

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

export const handleSearchHistory = (searchHistory) => dispatch => {
    dispatch(receiveSearchHistory(searchHistory))
}

