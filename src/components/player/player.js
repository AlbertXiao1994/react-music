import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import Scroll from 'base/scroll/scroll';
import { prefixStyle } from 'common/js/dom';
import animations from 'create-keyframe-animation';
import { getVkey } from 'api/getVkey';
import { ERR_OK } from 'api/config';
import ProgressCircle from 'base/progress-circle/progress-circle';
import ProgressBar from 'base/progress-bar/progress-bar';
import Lyric from 'lyric-parser';
import PlayList from 'components/playlist/playlist';
import { playMode } from 'common/js/config';

export default class Player extends Component {
    state = {
        songUrl: '',
        readyFlag: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
    }
    componentWillMount() {
        this.radius = 32
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    enter = () => {

    }
    afterEnter = () => {

    }
    leave = () => {

    }
    afterLeave = () => {

    }
    middleTouchStart = (e) => {
        e.preventDefault();
    }
    middleTouchMove = (e) => {
        e.preventDefault();
    }
    middleTouchEnd = () => {
    }
    onchangePercent = (percent) => {

    }
    isFavorite(song) {
        let index = this.props.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        if (index > -1) {
          return true
        } else {
          return false
        }
    }
    getFavoriteIcon(song) {
        if (this.isFavorite(song)) {
          return 'icon icon-favorite';
        } else {
          return 'icon icon-not-favorite';
        }
    }
    openPlayList = (e) => {
        e.stopPropagation();
    }
    togglePlay = (e) => {
        e.stopPropagation();
    }
    render() {
        const { playList, fullScreen, currentSong, playing } = this.props;
        const { playingLyric, currentLyric, percent, modeIcon } = this.state;
        const { readyFlag, playIcon, songUrl, currentLineNum } = this.state;
        const { currentTime, currentShow } = this.state;
        return (
            <div>
                {
                    playList.length>0
                    ? <div className="player">
                        <div name="normal"
                            enter={this.enter}
                            afterEnter={this.afterEnter}
                            leave={this.leave}
                            afterLeave={this.afterLeave}
                        >
                        {
                            fullScreen
                            ? <div className="normal-player">
                                <div className="background">
                                    <img width="100%" height="100%" src={currentSong.image} />
                                </div>
                                <div className="top">
                                    <div className="back" oncClick={this.back}>
                                        <i className="icon-back"></i>
                                    </div>
                                    <h1 className="title" dangerouslySetInnerHTML={currentSong.name}></h1>
                                    <h2 className="subtitle" dangerouslySetInnerHTML={currentSong.singer}></h2>
                                </div>
                                <div className="middle"
                                    onTouchstart="middleTouchStart"
                                    onTouchmove="middleTouchMove"
                                    onTouchend="middleTouchEnd"
                                >
                                    <div className="middle-l" ref={middleL=>this.middleL=middleL}>
                                        <div className="cd-wrapper" ref={cdWrapper=>this.cdWrapper=cdWrapper}>
                                            <div className={playing?"cd play":"cd play pause"}>
                                                <img className="image" src={currentSong.image} />
                                            </div>
                                        </div>
                                        <div className="playing-lyric-wrapper">
                                            <div className="playing-lyric">{playingLyric}</div>
                                        </div>
                                    </div>
                                    <Scroll 
                                        className="middle-r"
                                        data={currentLyric && currentLyric.lines}
                                        ref={lyricList=>this.lyricList=lyricList}
                                    >
                                        <div className="lyric-wrapper">
                                        {
                                            currentLyric
                                            ? <div v-if="currentLyric">
                                              {
                                                  currentLyric.lines.map((line,index) =>
                                                    <p
                                                        className={currentLineNum===index?"text current":"text"} 
                                                        ref={lyricLine=>this.lyricLine=lyricLine}
                                                        dangerouslySetInnerHTML={line.txt}>
                                                    </p>
                                                  )
                                              }
                                             </div>
                                            : ''
                                        }
                                        </div>
                                    </Scroll>
                                </div>
                                <div className="bottom">
                                    <div className="dot-wrapper">
                                        <span className={currentShow==='cd'?"dot active":"dot"}></span>
                                        <span className={currentShow==='lyric'?"dot active":"dot"}></span>
                                    </div>
                                    <div className="progress-wrapper">
                                        <span className="time time-l">{()=>this.formatTime(currentTime)}</span>
                                        <div className="progress-bar-wrapper">
                                            <ProgressBar percent={percent} changePercent={this.onchangePercent}></ProgressBar>
                                        </div>
                                        <span className="time time-r">{()=>this.formatTime(currentSong.duration)}</span>
                                    </div>
                                    <div className="operators">
                                        <div className="icon i-left" onClick={this.toggleMode}>
                                            <i className={modeIcon}></i>
                                        </div>
                                        <div className={readyFlag?"icon i-left":"icon i-left disable"}>
                                            <i className="icon-prev" onClick={this.prev}></i>
                                        </div>
                                        <div className={readyFlag?"icon i-center":"icon i-center disable"}>
                                            <i className={playIcon} onClick={this.togglePlay}></i>
                                        </div>
                                        <div className={readyFlag?"icon i-right":"icon i-right disable"}>
                                            <i className="icon-next" onClick={this.next}></i>
                                        </div>
                                        <div className="icon i-right">
                                            <i className={()=>this.getFavoriteIcon(currentSong)} onClick={()=>this.toggleFavorite(currentSong)}></i>
                                        </div>
                                    </div>
                                </div>
                              </div>
                            : ''
                        }
                        </div>
                        <div name="mini">
                        {
                            !fullScreen
                            ? <div className="mini-player" onClick={this.open}>
                                <div class="icon">
                                    <img
                                        width="40"
                                        height="40"
                                        src={currentSong.image}
                                        className={playing?"play":"play pause"}
                                        alt=""
                                    />
                                </div>
                                <div className="text">
                                <h2 className="name" dangerouslySetInnerHTML={currentSong.name}></h2>
                                <p classNAme="desc" dangerouslySetInnerHTML={currentSong.singer}></p>
                                </div>
                                <div className="control">
                                    <ProgressCircle radius={this.radius} percent={percent}>
                                        <i className={playing?"icon-mini icon-pause-mini":"icon-mini icon-play-mini"} onClick={this.togglePlay}></i>
                                    </ProgressCircle>
                                </div>
                                <div className="control" onClick={this.openPlayList}>
                                    <i className="icon-playlist"></i>
                                </div>
                              </div>
                            : ''
                        }
                        </div>
                        <PlayList ref={playList=>this.playList} />
                        <audio src={songUrl} ref={audio=>this.audio=audio} onPlay={this.ready} onError={this.error} onTimeUpdate={this.updateTime} onEnded={this.end}></audio>
                      </div>
                    : ''
                }
            </div>
        );
    }
}