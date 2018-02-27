import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import MusicList from 'components/music-list/music-list';
import { getClassifiedTop } from 'api/rank';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTopList } from '@/store/reducers';

class TopList extends Component {
    state = {
        songs: [],
        rank: true,
        bgImage: ''
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentWillMount() {
        this.rank = true
    }
    componentDidMount() {
        this._getClassifiedTop()
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.songs !== this.state.songs) {
            let songs = nextState.songs;
            this.setState({bgImage: songs[0].image})
        }
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
        const { songs, bgImage } = this.state;
        const { topList } = this.props;
        return (
            <div name="slide">
                <MusicList 
                    bgImage={bgImage}
                    title={topList.ListName}
                    songs={songs}
                    rank={this.rank}
                >
                </MusicList>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    topList: getTopList(state)
})

export default connect(mapStateToProps)(TopList)