import React, { Component } from 'react';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
// import MusicList from 'components/music-list/music-list';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';

class SingerDetail extends Component {
    state = {
        bgImage: '',
        title: '',
        songs: []
    }
    componentWillMount() {
        // this._getSingerDetail()
        console.log(this.props.singer)
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
                {/* <MusicList
                    bg-image={this.state.bgImage}
                    title={this.state.title}
                    songs={this.state.songs}>
                </MusicList> */}
                SingerDetail
            </div>
        );
    }
}

const mapStateToProps = state => ({
    singer: state.singer
})

// const mapDispatchToProps = (dispatch) => ({
//     setSinger
// })

export default connect(mapStateToProps)(SingerDetail)