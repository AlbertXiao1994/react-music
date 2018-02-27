import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import MusicList from 'components/music-list/music-list';
import { getClassifiedTop } from 'api/rank';
import PropTypes from 'prop-types';

export default class TopList extends Component {
    state = {
        bgImage: '',
        title: '',
        songs: [],
        rank: true
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentWillMount() {
        this._getClassifiedTop() 
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    _getClassifiedTop = () => {
        if (!this.props.topList.topID) {
            this.context.router.history.push('/rank')
            return;
        }
        getClassifiedTop(this.props.topList.topID).then((res) => {
            if (res.code === ERR_OK) {
              this.setState({songs: this._normalizeSongs(res.songlist)})
            }
          }, (err) => {
            console.log(err)
        })
    }
    _normalizeSongs = (list) => {
        let ret = []
        list.forEach((item) => {
          let musicData = item.data
          ret.push(createSong(musicData))
        })
        return ret;
    }
    render() {
        const { bgImage, title, songs, rank } = this.state;
        return (
            <div name="slide">
                <MusicList 
                    bgImage={bgImage}
                    title={title}
                    songs={songs}
                    rank={rank}
                >
                </MusicList>
            </div>
        );
    }
}