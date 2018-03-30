import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { is, fromJS } from 'immutable';
import './song-list.less';

export default class SongList extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps));
    }
    selectItem = (song, index) => {
        if (song.payplay === 1) {
          return;
        }
        this.props.select(song, index)
    }
    getRankCls = (index) => {
        if (index <= 2) {
          return `icon icon${index}`;
        } else {
          return 'text';
        }
    }
    getRankText = (index) => {
        if (index <= 2) {
          return '';
        } else {
          return index;
        }
    }
    render() {
        return (
            <div className="song-list">
                <ul>
                    {
                        this.props.songs.map((song, index) =>
                        <li className="item" onClick={()=>{this.selectItem(song,index)}} key={index}>
                            {
                                this.props.rank
                                ? <div className="rank">
                                    <span className={this.getRankCls(index)}>{this.getRankText(index)}</span>
                                </div>
                                : ''
                            }
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

SongList.propTypes = {
    songs: PropTypes.array,
    rank: PropTypes.bool
};

SongList.defaultProps = {
    songs:[],
    rank: false
};