import * as types from './action-types';

const receiveSinger = (singer) => {
    return {
        type: types.SET_SINGER,
        singer
    }
}

export const setSinger = (singer) => dispatch => {
    dispatch(receiveSinger(singer))
}

