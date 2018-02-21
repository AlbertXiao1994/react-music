import * as types from '../action-type';

const defaultState = {
    singer: {}
}

export const singer = (state = defaultState, action) => {
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