import * as types from '../action-types';
import { combineReducers } from 'redux';

const initialState = {
    singer: {},
    topList: {},
    disc: {}
}

export const singer = (state = initialState.singer, action) => {
    switch(action.type) {
        case types.SET_SINGER:
            return {
                ...state,
                ...action.singer
            };
        default: 
            return state;
    }
}

export const topList = (state = initialState.topList, action) => {
    switch(action.type) {
        case types.SET_TOP_LIST:
            return {
                ...state,
                topList: action.topList
            };
        default: 
            return state;
    }
}

export const disc = (state = initialState.disc, action) => {
    switch(action.type) {
        case types.SET_DISC:
            return {
                ...state,
                disc: action.disc
            };
        default: 
            return state;
    }
}

export const getSinger = state => state.singer

export const getTopList = state => state.topList

export const getDisc = state => state.disc

export default combineReducers({
    singer,
    topList,
    disc
})