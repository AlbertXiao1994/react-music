import * as types from '../action-types';
import { loadSearchHistory, loadPlayHistory, loadFavorite } from 'common/js/cache';
import { combineReducers } from 'redux';

const initialState = {
    searchHistory: loadSearchHistory(),
    playHistory: loadPlayHistory(),
    favoriteList: loadFavorite()
}

export const searchHistory = (state = initialState.searchHistory, action) => {
    switch(action.type) {
        case types.SET_SEARCH_HISTORY:
            return {
                ...state,
                ...action.searchHistory
            };
        default: 
            return state;
    }
}

export const playHistory = (state = initialState.playHistory, action) => {
    switch(action.type) {
        case types.SET_PLAY_HISTORY:
            return [
                ...state,
                ...action.playHistory
            ];
        default: 
            return state;
    }
}

export const favoriteList = (state = initialState.favoriteList, action) => {
    switch(action.type) {
        case types.SET_FAVORITE_LIST:
            return [
                ...state,
                ...action.favoriteList
            ];
        default: 
            return state;
    }
}

export default combineReducers({
    searchHistory,
    playHistory,
    favoriteList
})

export const getSearchHistory = state => state.searchHistory

export const getPlayHistory = state => state.playHistory

export const getFavoriteList = state => state.favoriteList