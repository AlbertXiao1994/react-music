import * as types from '../action-types';
import { loadSearchHistory } from 'common/js/cache';
// import { combineReducers } from 'redux';

const initialState = {
    searchHistory: loadSearchHistory()
}

export const searchHistory = (state = initialState, action) => {
    switch(action.type) {
        case types.SET_SINGER:
            return {
                ...state,
                searchHistory: action.searchHistory
            };
        default: 
            return state;
    }
}

export const getSearchHistory = state => state.searchHistory