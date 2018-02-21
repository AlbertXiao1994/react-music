import React, { Component } from 'react';

export default class SongList extends Component {
    render() {
        return (
            <div className="song-list">
                <ul>
                    {
                        this.props.songs.map((song, index) =>
                        <li className="item" onClick="selectItem(song,index)" key={index}>
                            this.props.rank
                            ? <div className="rank">
                                <span className={this.getRankCls(index)}>{this.getRankText(index)}</span>
                              </div>
                            : ''
                            
                            <div className="content">
                                <h2 className={song.payplay===1?"name invalid":"name"}>{song.name}</h2>
                                <p className="desc">{song.singer}·{song.album}</p>
                            </div>
                        </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}