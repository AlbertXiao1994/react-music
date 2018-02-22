import * as types from '../action-types';

const defaultState = {
    singer: {}
}

export const setSinger = (state = defaultState, action) => {
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

// export const getSinger = state => state.singer
