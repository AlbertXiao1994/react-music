import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { prefixStyle } from 'common/js/dom';
import { is, fromJS } from 'immutable';
import createHistory from "history/createBrowserHistory";

const history = createHistory();

const RESERVED_HEIGHT = 40;
const transform = prefixStyle('transform');

export default class MusicList extends Component {
    state = {
        bgStyle: '',
        scrollY: 0
    };
    componentWillMount() {
        this.probeType = 3
        this.listenScroll = true
    }
    componentDidMount() {
        this.imageHeight = this.bgImage.clientHeight
        this.maxTranslateY = -this.imageHeight + RESERVED_HEIGHT
        this.list.style.top = `${this.imageHeight}px`
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    handleScroll = (pos) => {
        this.setState({scrollY: pos.y})
        let { scrollY } = this.state;
        
        let translateY = Math.max(this.maxTranslateY, scrollY);
        let scale = 1;
        let zIndex = 0;

        this.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
        if (scrollY > 0) {
          zIndex = 10
          let percent = scrollY / this.imageHeight
          scale += percent
          this.bgImage.style[transform] = `scale(${scale})`
        }
        if (scrollY < this.maxTranslateY) {
          zIndex = 10
          this.bgImage.style.paddingTop = 0
          this.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.playBtn.style.display = 'none'
        } else {
          this.bgImage.style.paddingTop = '70%'
          this.bgImage.style.height = 0
          this.playBtn.style.display = 'block'
        }
        this.bgImage.style.zIndex = `${zIndex}`
    }
    back = () => {
        history.goBack()
    }
    randomPlayAll = () => {

    }
    _filterSongs = (list) => {
        let ret = []
        ret = list.filter((song) => {
          // 免费播放
          return song.payplay === 0;
        })
        return ret;
    }
    render() {
        return (
            <div>
                <div className="back" onClick={this.back}>
                    <i className="icon-back"></i>
                </div>
                <h1 className="title">{this.props.title}</h1>
                <div className="bg-image" style={this.state.bgStyle} ref={bgImage => this.bgImage = bgImage}>
                    <div className="filter"></div>
                    <div className="play-wrapper">
                    songs.length>0
                    ? <div 
                        ref={playBtn => this.playBtn=playBtn}
                        className="play"
                        onClick={this.randomPlayAll}
                      >
                        <i className="icon-play"></i>
                        <span className="text">随机播放全部</span>
                      </div>
                    : ''
                    </div>
                </div>
                <div className="bg-layer" ref={bgLayer => this.bgLayer = bgLayer}></div>
                <Scroll 
                    data={this.props.songs}
                    className="list"
                    probeType={this.probeType}
                    listenScroll={this.listenScroll}
                    scroll={this.handleScroll}
                    ref={list => this.list = list}
                >
                    <div className="song-list-wrapper">
                        <SongList songs={this.props.songs} select={this.onSelect} rank={this.props.rank} />
                    </div>
                    <div className="loading-wrapper">
                        <Loading />
                    </div>
                </Scroll>
            </div>
        );
    }
}

MusicList.propTypes = {
    bgImage: PropTypes.string,
    title: PropTypes.string,
    songs: PropTypes.Array,
    rank: PropTypes.bool
}

MusicList.defaultProps = {
    bgImage: '',
    title: '',
    songs: [],
    rank: false
}