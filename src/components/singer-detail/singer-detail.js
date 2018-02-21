import React, { Component } from 'react';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import MusicList from 'components/music-list/music-list';
import createHistory from "history/createBrowserHistory";

const history = createHistory();

export default class SingerDetail extends Component {
    state = {
        bgImage: '',
        title: '',
        songs: []
    }
    _getSingerDetail() {
        if (!this.singer.id) {
          history.push('/singer')
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
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
                    bg-image={this.state.bgImage}
                    title={this.state.title}
                    songs={this.state.songs}>
                </MusicList>
            </div>
        );
    }
}