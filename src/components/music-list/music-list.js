import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { prefixStyle } from 'common/js/dom';
import { is } from 'immutable';
import './music-list.less';
import { connect } from 'react-redux';
import { selectPlay, randomPlay } from '@/store/actions';
import { getPlayList } from '@/store/reducers';
import { CSSTransition } from 'react-transition-group';

const RESERVED_HEIGHT = 40;
const transform = prefixStyle('transform');

class MusicList extends Component {
    state = {
        scrollY: 0,
        scrollStyle: {},
        bgStyle: {},
        show: false
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentWillMount() {
        this.probeType = 3
        this.listenScroll = true
        this.setState({
            bgStyle: {
                backgroundImage:`url(${this.props.bgImage})`
            }
        })
    }
    componentDidMount() {
        this.imageHeight = this.bgImage.clientHeight
        this.maxTranslateY = -this.imageHeight + RESERVED_HEIGHT
        this.setState({
            scrollStyle: {top:`${this.imageHeight}px`},
            show: true
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.bgImage !== this.props.bgImage) {
            this.setState({
                bgStyle: {
                    backgroundImage:`url(${nextProps.bgImage})`
                }
            })
        }
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}) {
        const thisProps = this.props || {}, thisState = this.state || {};

        if (Object.keys(thisProps).length !== Object.keys(nextProps) ||
            Object.keys(thisState).length !== Object.keys(nextState)) {
                return true;
        }

        for (const key in nextProps) {
            if (!is(nextProps[key], thisProps[key])) {
                return true;
            }
        }

        for (const key in nextState) {
            if (!is(nextState[key], thisState[key])) {
                return true;
            }
        }

        return false;
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
        this.setState({show: false})
        // 从context获取history
        setTimeout(() => {
            this.context.router.history.goBack()
        }, 500)
    }
    randomPlayAll = () => {
        this.props.randomPlay({
            list: this._filterSongs(this.props.songs)
        })
    }
    onSelect = (song, index) => {
        this.props.selectPlay({
          list: this._filterSongs(this.props.songs),
          index
        })
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
            <CSSTransition classNames="slide" timeout={500} in={this.state.show}>
                <div className="music-list">
                    <div className="back" onClick={this.back}>
                        <i className="icon-back"></i>
                    </div>
                    <h1 className="title">{this.props.title}</h1>
                    <div className="bg-image" style={this.state.bgStyle} ref={bgImage => this.bgImage = bgImage}>
                        <div className="filter"></div>
                        <div className="play-wrapper">
                        {
                            this.props.songs.length>0
                            ? <div 
                                ref={playBtn => this.playBtn=playBtn}
                                className="play"
                                onClick={this.randomPlayAll}
                            >
                                <i className="icon-play"></i>
                                <span className="text">随机播放全部</span>
                            </div>
                            : ''
                        }
                        </div>
                    </div>
                    <div className="bg-layer" ref={bgLayer => this.bgLayer = bgLayer}></div>
                    <Scroll 
                        data={this.props.songs}
                        className="list"
                        probeType={this.probeType}
                        listenScroll={this.listenScroll}
                        scroll={this.handleScroll}
                        style={this.state.scrollStyle}
                    >
                        <div className="song-list-wrapper">
                            <SongList songs={this.props.songs} select={this.onSelect} rank={this.props.rank} />
                        </div>
                        <div className="loading-wrapper">
                            <Loading />
                        </div>
                    </Scroll>
                </div>
            </CSSTransition>
        );
    }
}

MusicList.propTypes = {
    bgImage: PropTypes.string,
    title: PropTypes.string,
    songs: PropTypes.array,
    rank: PropTypes.bool
}

MusicList.defaultProps = {
    bgImage: '',
    title: '',
    songs: [],
    rank: false
}

const mapStateToProps = (state) => ({
    playList: getPlayList(state)
})

const mapDispatchToProps =  {
    selectPlay,
    randomPlay
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicList)