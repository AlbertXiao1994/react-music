import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import './playlist.less';
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import { playMode } from 'common/js/config';
import AddSong from 'components/add-song/add-song';
import Song from 'common/js/song';

export default class PlayList extends Component {
    state = {
        showFlag: false
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    show = () => {
        this.setState({showFlag: true})
        setTimeout(() => {
          this.listContent.refresh()
          this.scrollTocurrent(this.props.currentSong)
        }, 20)
    }
    hide() {
        this.setState({showFlag: false})
    }
    scrollTocurrent = (song) => {
        let index = this.sequenceList.findIndex((item) => {
          return item.id === song.id
        })
        this.listContent.scrollToElement(this.list.props.children[index], 300)
    }
    deleteOne = (song) => {
        this.props.deleteSong(song)
        if (!this.props.sequenceList.length) {
          this.hide()
        }
    }
    clearAll = () => {
        this.confirm.show()
    }
    selectItem = (song, index) => {
        if (this.props.mode === playMode.random) {
          index = this.props.playList.findIndex((item) => {
            return item.id === song.id
          })
        }
        this.props.setCurrentIndex(index)
        this.props.setPlayingState(true)
    }
    onConfirm = () => {
        this.props.clearSong()
        this.hide()
    }
    addSong() {
        this.addSong.show()
    }
    getCurrentPlay = (song) => {
        if (song.id === this.currentSong.id) {
          return 'current icon-play';
        } else {
          return 'current';
        }
    }
    getFavoriteIcon = (song) => {
        if (this.isFavorite(song)) {
          return 'icon-favorite'
        } else {
          return 'icon-not-favorite'
        }
    }
    toggleFavorite = (song) => {
        if (this.isFavorite(song)) {
          this.deleteFavoriteList(song)
        } else {
          this.props.saveFavoriteList(new Song(song))
        }
    }
    isFavorite = (song) => {
        let index = this.props.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        if (index > -1) {
          return true
        } else {
          return false
        }
    }
    deleteOne(e, song) {
        e.stopPropagation()
        this.deleteSong(song)
        if (!this.sequenceList.length) {
          this.hide()
        }
    }
    handleToggleFav = (e, song) => {
        e.stopPropagation();
        this.props.toggleFavorite(song)
    }
    render() {
        const modeText = this.props.mode === playMode.sequence 
                         ? '顺序播放'
                         : this.props.mode === playMode.random ? '随机播放' : '单曲循环';
        const modeIcon = this.props.mode === playMode.sequence
                         ? 'icon icon-sequence'
                         : this.props.mode === playMode.random ? 'icon icon-random' : 'icon icon-loop';
        return (
            <div name="list-fade">
            {
                this.state.showFlag
                ? <div className="playlist" onClick={this.hide}>
                    <div className="list-wrapper" onClick={(e)=>e.stopPropagation()}>
                        <div className="list-header">
                        <h1 className="title">
                            <i className={modeIcon} onClick={this.props.toggleMode}></i>
                            <span className="text">{modeText}</span>
                            <span className="clear" onClick={this.clearAll}><i className="icon-clear"></i></span>
                        </h1>
                        </div>
                        <Scroll 
                            ref={listContent=>this.listContent=listContent}
                            className="list-content"
                            data={this.props.sequenceList}
                        >
                            <ul ref={list=>this.list=list} name="list">
                            {
                                this.props.sequenceList.map((song,index) =>
                                    <li key={song.id} className="item" onClick={()=>this.selectItem(song, index)}>
                                        <i className={()=>this.getCurrentPlay(song)}></i>
                                        <span className="text" dangerouslySetInnerHTML={song.name}></span>
                                        <span className="like" onClick={(e)=>{this.handleToggleFav(e, song)}}>
                                            <i className={()=>this.getFavoriteIcon(song)}></i>
                                        </span>
                                        <span className="delete" onClick={(e)=>this.deleteOne(e, song)}>
                                            <i className="icon-delete"></i>
                                        </span>
                                    </li>
                                )
                            }
                            </ul>
                        </Scroll>
                        <div className="list-operate">
                            <div className="add" onClick={this.addSong}>
                                <i className="icon-add"></i>
                                <span className="text">添加歌曲到队列</span>
                            </div>
                        </div>
                        <div className="list-close" onClick={this.hide}>
                            <span>关闭</span>
                        </div>
                    </div>
                    <Confirm
                        ref={confirm=>this.confirm=confirm}
                        text="是否清空播放列表"
                        confirmBtnText="清空"
                        confirm={this.onConfirm}>
                    </Confirm>
                    <AddSong ref={addSong=>this.addSong=addSong}></AddSong>
                  </div>
                : ''
            }
            </div>
        );
    }
}