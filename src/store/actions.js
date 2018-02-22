import * as types from './action-types';

const receiveSinger = singer => ({
    type: types.SET_SINGER,
    singer
})

export const setSinger = (singer) => dispatch => {
    console.log(singer)
    dispatch(receiveSinger(singer))
}

