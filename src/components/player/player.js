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
import './player.less';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transformDuration');

export default class Player extends Component {
    state = {
        songUrl: '',
        readyFlag: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        scrollStyle: {}
    }
    componentWillMount() {
        this.radius = 32
        this.touch = {}
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    enter = (el, done) => {
        const {x, y, scale} = this._getPosAndScale()
  
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
  
        animations.registerAnimation({
          name: 'move',
          animation,
          preset: {
            duration: 400,
            easing: 'linear'
          }
        })
  
        animations.runAnimation(this.cdWrapper, 'move', done)
      }
    afterEnter = () => {
        animations.unregisterAnimation('move')
        this.cdWrapper.style.animation = ''
    }
    leave = (el, done) => {
        this.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.cdWrapper.addEventListener('transitionend', done)
    }
    afterLeave = () => {
        this.cdWrapper.style.transition = ''
        this.cdWrapper.style[transform] = ''
    }
    next = () => {
        if (!this.state.readyFlag) {
          return;
        }
        if (this.props.playList.length === 1) {
          this.loop()
          return;
        } else {
          let index = this.props.currentIndex + 1
          if (index === this.props.playList.length) {
            index = 0
          }
          if (!this.props.playing) {
            this.togglePlay()
          }
          this.props.setCurrentIndex(index)
        }
        this.setState({readyFlag: false})
    }
    prev = () => {
        if (!this.state.readyFlag) {
          return
        }
        if (this.props.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.props.currentIndex - 1
          if (index === -1) {
            index = this.props.playList.length - 1
          }
          if (!this.props.playing) {
            this.togglePlay()
          }
          this.props.setCurrentIndex(index)
        }
        this.readyFlag = false
    }
    ready = () => {
        this.setState({readyFlag: true})
        this.props.savePlayHistory(this.props.currentSong)
    }
    error = () => {
        this.setState({readyFlag: true})
    }
    end = () => {
        if (this.props.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
    }
    loop = () => {
        this.audio.currentTime = 0
        this.audio.play()
        if (this.state.currentLyric) {
          this.state.currentLyric.seek(0)
        }
    }
    updateTime = (e) => {
        this.setState({currentTime: e.target.currentTime})
    }
    togglePlay = (e) => {
        e.stopPropagation();
        if (!this.state.readyFlag) {
          return;
        }
        this.props.setPlayingState(!this.props.playing)
        if (this.state.currentLyric) {
          this.state.currentLyric.togglePlay()
        }
    }
    getSongURL = (song) => {
        let t = (new Date()).getUTCMilliseconds()
        let guid = Math.round(2147483647 * Math.random()) * t % 1e10
        getVkey(song, guid).then((res) => {
          if (res.code === ERR_OK) {
            let info = res.data.items[0]
            let url = `http://dl.stream.qqmusic.qq.com/${info.filename}?vkey=${info.vkey}&guid=${guid}&uin=0&fromtag=66`
            this.setState({songUrl: url})
          }
        }, (err) => {
          console.log(err)
        })
    }
    formatTime = (time) => {
        time = time | 0
        let minutes = time / 60 | 0
        let seconds = this._pad(time % 60)
        return `${minutes}:${seconds}`;
    }
    onchangePercent = (percent) => {
        let currentTime = this.props.currentSong.duration * percent
        this.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlay()
        }
        this.state.currentLyric.seek(currentTime * 1000)
    }
    getLyric = () => {
        this.props.currentSong.getLyric().then((lyric) => {
          if (this.props.currentSong.lyric !== lyric) {
            return;
          }
          this.setState({currentLyric: new Lyric(lyric, this.handleLyric)})
          if (this.props.playing) {
            this.state.currentLyric.play()
          }
        }).catch(() => {
          this.setState({
            currentLyric: null,
            currentTime: 0,
            currentLineNum: 0,
            playingLyric: ''
          })
        })
    }
    handleLyric = ({lineNum, txt}) => {
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.lyricList.scrollTo(0, 0, 1000)
        }
        this.setState({
            currentLineNum: lineNum,
            playingLyric: txt
        })
    }
    middleTouchStart = (e) => {
        e.preventDefault();
        this.touch.initiated = true
        // 用来判断是否是一次移动
         this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
    }
    middleTouchMove = (e) => {
        e.preventDefault();
        if (!this.touch.initiated) {
            return;
          }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }
        if (!this.touch.moved) {
            this.touch.moved = true
        }
        const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.setState({
            scrollStyle: {
                [transform]: `translate3d(${offsetWidth}px,0,0)`,
                [transitionDuration]: 0
            }
        })
        this.middleL.style.opacity = 1 - this.touch.percent
        this.middleL.style[transitionDuration] = 0
    }
    middleTouchEnd = () => {
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
    getFavoriteIcon = (song) => {
        if (this.isFavorite(song)) {
          return 'icon icon-favorite';
        } else {
          return 'icon icon-not-favorite';
        }
    }
    openPlayList = (e) => {
        e.stopPropagation();
        this.playList.show()
    }
    _pad = (num, n = 2) => {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num;
    }
    _getPosAndScale = () => {
        let targetWidth = 40;
        let paddingLeft = 40;
        let paddingBottom = 30;
        let paddingTop = 80;
        let width = window.innerWidth * 0.8;
        let scale = targetWidth / width;
        let x = -(window.innerWidth / 2 - paddingLeft);
        let y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
        return {
          x,
          y,
          scale
        };
    }
    render() {
        const { playList, fullScreen, currentSong, playing } = this.props;
        const { playingLyric, currentLyric, percent, modeIcon } = this.state;
        const { readyFlag, playIcon, songUrl, currentLineNum } = this.state;
        const { currentTime, currentShow, scrollStyle } = this.state;
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
                                    <img width="100%" height="100%" src={currentSong.image} alt="" />
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
                                                <img className="image" src={currentSong.image} alt="" />
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
                                        style={scrollStyle}
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