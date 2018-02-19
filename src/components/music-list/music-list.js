import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { prefixStyle } from 'common/js/dom';

const RESERVED_HEIGHT = 40;
const transform = prefixStyle('transform');

export default class MusicList extends Component {
    state = {
        bgStyle: ''
    }
    back = () => {

    }
    randomPlayAll = () => {

    }
    render() {
        return (
            <div>
                <div className="back" onClick={this.back}>
                    <i className="icon-back"></i>
                </div>
                <h1 className="title">{this.props.title}</h1>
                <div className="bg-image" style={this.state.bgStyle} ref={bgImage => this.bgImage=bgImage}>
                    <div className="filter"></div>
                    <div className="play-wrapper">
                    songs.length>0
                    ? <div 
                        ref={playBtn => this.playBtn=playBtn}
                        className="play"
                        onClick={this.randomPlayAll}
                      >
                        <i class="icon-play"></i>
                        <span class="text">随机播放全部</span>
                      </div>
                    : ''
                    </div>
                </div>
                <div class="bg-layer" ref="bgLayer"></div>
                <Scroll 
                    data={this.props.songs}
                    className="list"
                    probeType={this.probeType}
                    listenScroll={this.listenScroll}
                    scroll={this.handleScroll}
                    ref={list => this.list = list}
                >
                    <div class="song-list-wrapper">
                        <SongList songs={this.props.songs} select={this.onSelect} rank={this.props.rank} />
                    </div>
                    <div class="loading-wrapper">
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