import * as types from '../action-types';
import { combineReducers } from 'redux';
import { playMode as PlayMode } from 'common/js/config';

const initialState = {
    playState: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    playMode: PlayMode.sequence,
    currentIndex: -1
}

export const playState = (state = initialState.playState, action) => {
    switch(action.type) {
        case types.SET_PLAY_STATE:
            return action.playState;
        default: 
            return state;
    }
}

export const fullScreen = (state = initialState.fullScreen, action) => {
    switch(action.type) {
        case types.SET_FULL_SCREEN:
            return action.fullScreen;
        default: 
            return state;
    }
}

export const playList = (state = initialState.playList, action) => {
    switch(action.type) {
        case types.SET_PLAY_LIST:
            return [
                ...state,
                ...action.playList
            ];
        default: 
            return state;
    }
}

export const sequenceList = (state = initialState.sequenceList, action) => {
    switch(action.type) {
        case types.SET_SEQUENCE_LIST:
            return [
                ...state,
                ...action.sequenceList
            ];
        default: 
            return state;
    }
}

export const playMode = (state = initialState.playMode, action) => {
    switch(action.type) {
        case types.SET_PLAY_MODE:
            return action.playMode;
        default: 
            return state;
    }
}

export const currentIndex = (state = initialState.currentIndex, action) => {
    switch(action.type) {
        case types.SET_CURRENT_INDEX:
            return action.currentIndex;
        default: 
            return state;
    }
}

export const getPlayState = state => state.playState

export const getFullScreen = state => state.fullScreen

export const getPlayList = state => state.playList

export const getSequenceList = state => state.sequenceList

export const getPlayMode = state => state.playMode

export const getCurrentIndex = state => state.currentIndex

export default combineReducers({
    playState,
    fullScreen,
    playList,
    sequenceList,
    playMode,
    currentIndex
})