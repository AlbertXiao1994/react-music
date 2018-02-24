import { combineReducers } from 'redux';
import { setSinger } from './list';
import * as history from './history';
import * as player from './player';
import * as fromList from './list';

export default combineReducers({
    setSinger,
    ...history,
    ...player
})

export const getSinger = (state) => {
    console.log(state)
    return fromList.getSinger(state.setSinger)
}