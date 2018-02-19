import React, { Component } from 'react';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import MusicList from 'components/music-list/music-list';

export default class SingerDetail extends Component {
    state = {
        bgImage: '',
        title: '',
        songs: []
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