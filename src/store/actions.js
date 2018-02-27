import * as types from './action-types';
import { saveSearch, clearSearch, deleteSearch } from 'common/js/cache';
import { savePlay, saveFavorite, deleteFavorite } from 'common/js/cache';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';

/*
 * Action生成器
 */
const receiveSinger = (singer) => {
    return {
        type: types.SET_SINGER,
        singer
    }
}

const receiveSearchHistory = (searchHistory) => {
    return {
        type: types.SET_SEARCH_HISTORY,
        searchHistory
    }
}

const receivePlayHistory = (playHistory) => {
    return {
        type: types.SET_PLAY_HISTORY,
        playHistory
    }
}

const receiveFavoriteList = (favoriteList) => {
    return {
        type: types.SET_FAVORITE_LIST,
        favoriteList
    }
}

const receiveDisc = (disc) => {
    return {
        type: types.SET_DISC,
        disc
    }
}

const receiveTopList = (topList) => {
    return {
        type: types.SET_TOP_LIST,
        topList
    }
}

const receivePlayState= (flag) => {
    return {
        type: types.SET_PLAY_STATE,
        playState: flag
    }
}

const receiveFullScreen = (flag) => {
    return {
        type: types.SET_FULL_SCREEN,
        fullScreen: flag
    }
}

const receivePlayList = (playList) => {
    return {
        type: types.SET_PLAY_LIST,
        playList
    }
}

const receiveSequenceList = (sequenceList) => {
    return {
        type: types.SEQUENCE_LIST,
        sequenceList
    }
}

const receivePlayMode = (playMode) => {
    return {
        type: types.SET_PLAY_MODE,
        playMode
    }
}

const receiveCurrentIndex = (currentIndex) => {
    return {
        type: types.SET_CURRENT_INDEX,
        currentIndex
    }
}

/*
 * 封装Action dispatch
 */
export const setSinger = (singer) => dispatch => {
    dispatch(receiveSinger(singer))
}

export const saveSearchHistory = (query) => dispatch => {
    let searchHistory = saveSearch(query)
    dispatch(receiveSearchHistory(searchHistory))
}

export const clearSearchHistory = () => dispatch => {
    let searchHistory = clearSearch()
    dispatch(receiveSearchHistory(searchHistory))
}

export const deleteSearchHistory = (query) => dispatch => {
    let searchHistory = deleteSearch(query)
    dispatch(receiveSearchHistory(searchHistory))
}

export const saveFavoriteList = (song) => dispatch => {
    let favoriteList = saveFavorite(song)
    dispatch(receiveFavoriteList(favoriteList))
}

export const savePlayHistory = (song) => dispatch => {
    let playHistory = savePlay(song)
    dispatch(receivePlayHistory(playHistory))
}

export const deleteFavoriteList = (song) => dispatch => {
    let favoriteList = deleteFavorite(song)
    dispatch(receiveFavoriteList(favoriteList))
}

export const setDisc = (disc) => dispatch => {
    dispatch(receiveDisc(disc))
}

export const setTopList = (topList) => dispatch => {
    dispatch(receiveTopList(topList))
}

export const setPlayState = (flag) => dispatch => {
    dispatch(receivePlayState(flag))
}

export const setFullScreen = (flag) => dispatch => {
    dispatch(receiveFullScreen(flag))
}

export const setPlayList = (playList) => dispatch => {
    dispatch(receivePlayList(playList))
}

export const setSequenceList = (sequenceList) => dispatch => {
    dispatch(receiveSequenceList(sequenceList))
}

export const setPlayMode = (playMode) => dispatch => {
    dispatch(receivePlayMode(playMode))
}

export const setCurrentIndex = (index) => dispatch => {
    dispatch(receiveCurrentIndex(index))
}

function findIndex(list, song) {
    return list.findIndex((item) => {
      return item.id === song.id
    })
}

/*
 * 派发多个Action
 */
 export const selectPlay = ({list, index}) => (dispatch, getState) => {
    dispatch(receiveSequenceList(list))
    if (getState().player.playMode === playMode.random) {
        let randomList = shuffle(list)
        dispatch(receivePlayList(randomList))
        index = findIndex(randomList, list[index])
    } else {
        dispatch(receivePlayList(list))
    }
    dispatch(receivePlayState(true))
    dispatch(receiveFullScreen(false))
    dispatch(receiveCurrentIndex(index))
 }

 export const randomPlay = ({list}) => (dispatch, getState) => {
    dispatch(receivePlayMode(playMode.random))
    dispatch(receiveSequenceList(list))
    let randomList = shuffle(list)
    dispatch(receivePlayList(randomList))
    dispatch(receivePlayState(true))
    dispatch(receiveFullScreen(false))
    dispatch(receiveCurrentIndex(0))
}

export const insertSong = (song) => (dispatch, getState) => {
    // 当前播放信息
  let playList = getState().player.playList.slice()
  let sequenceList = getState().player.sequenceList.slice()
  let currentIndex = getState().player.currentIndex
  let currentSong = playList[currentIndex]

  // 查找插入歌曲在播放列表中的索引
  let fpIndex = findIndex(playList, song)

  // 插入歌曲，插入到下一首播放
  currentIndex++
  playList.splice(currentIndex, 0, song)

  // 如果播放列表包含这首歌
  if (fpIndex > -1) {
    // 如果原歌曲在插入位置之前
    if (fpIndex < currentIndex) {
      playList.splice(fpIndex, 1)
      // 原歌曲删除，索引减1
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  // 处理顺序列表
  let currentSIndex = findIndex(sequenceList, currentSong)
  currentSIndex++
  // 查找插入歌曲在顺序列表中的索引
  let fsIndex = findIndex(sequenceList, song)
  // 插入歌曲
  sequenceList.splice(currentSIndex, 0, song)

  // 如果顺序列表包含这首歌
  if (fsIndex > -1) {
    // 如果原歌曲在插入位置之前
    if (fsIndex < currentSIndex) {
      sequenceList.splice(fpIndex, 1)
      // 原歌曲删除，索引减1
    } else {
      sequenceList.splice(fpIndex + 1, 1)
    }
  }

  dispatch(receiveSequenceList(sequenceList))
  dispatch(receivePlayList(playList))
  dispatch(receivePlayState(true))
  dispatch(receiveFullScreen(false))
  dispatch(receiveCurrentIndex(currentIndex))
}

export const deleteSong = (song) => (dispatch, getState) => {
  // 当前播放信息
  let playList = getState().player.playList.slice()
  let sequenceList = getState().player.sequenceList.slice()
  let currentIndex = getState().player.currentIndex

  // 播放列表索引
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)

  // 顺序列表索引
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (pIndex < currentIndex) {
    currentIndex--
  }

  dispatch(receivePlayList(playList))
  dispatch(receiveSequenceList(sequenceList))
  if (!playList.length) {
    dispatch(receivePlayState(false))
  }
  dispatch(receiveCurrentIndex(currentIndex))
}

export const clearSong = () => (dispatch, getState) => {
    dispatch(receivePlayList([]))
    dispatch(receiveSequenceList([]))
    dispatch(receivePlayState(false))
    dispatch(receiveFullScreen(false))
    dispatch(receiveCurrentIndex(-1))
}