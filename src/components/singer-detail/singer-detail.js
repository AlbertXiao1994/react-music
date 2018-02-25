import React, { Component } from 'react';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import MusicList from 'components/music-list/music-list';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import { getSinger } from '@/store/reducers';
import PropTypes from 'prop-types';

class SingerDetail extends Component {
    state = {
        bgImage: '',
        title: '',
        songs: []
    }
    componentWillMount() {
        this._getSingerDetail()
        this.setState({bgImage: this.props.singer.avatar_m})
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    _getSingerDetail() {
        if (!this.props.singer.id) {
          this.props.history.push("/singer")
          return;
        }
        getSingerDetail(this.props.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.setState({songs: this._normalizeSongs(res.data.list)})
          }
        }, (err) => {
          console.log(err)
        })
    }
     _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let { musicData } = item
          ret.push(createSong(musicData))
        })
        return ret;
    }
    render() {
        return (
            <div>
                <MusicList
                    bgImage={this.state.bgImage}
                    title={this.state.title}
                    songs={this.state.songs}>
                </MusicList>
            </div>
        );
    }
}

SingerDetail.propTypes = {
    singer: PropTypes.object
}

SingerDetail.defaultProps = {
    singer: null
}

const mapStateToProps = state => ({
    singer: getSinger(state)
})

export default connect(mapStateToProps)(SingerDetail)