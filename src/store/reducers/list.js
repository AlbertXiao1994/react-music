import * as types from '../action-types';
import { combineReducers } from 'redux';

const initialState = {
    singer: {}
}

export const setSinger = (state = initialState, action) => {
    switch(action.type) {
        case types.SET_SINGER:
            return {
                ...state,
                singer: action.singer
            };
        default: 
            return state;
    }
}

export const getSinger = state => state.singer