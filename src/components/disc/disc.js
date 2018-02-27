import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { getDiscDetail } from 'api/disc';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import MusicList from 'components/music-list/music-list';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDisc } from '@/store/reducers';

class Disc extends Component {
    state = {
        songs: []
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentDidMount() {
        this._getDiscDetail()
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    _getDiscDetail = () => {
        if (!this.props.disc.dissid) {
            this.context.router.history.push('/recommend')
            return;
        }
        getDiscDetail(this.props.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.setState({songs: this._normalizeSongs(res.cdlist[0].songlist)})
          }
        }, (err) => {
          console.log(err)
        })
    }
    _normalizeSongs = (list) => {
        let ret = []
        list.forEach((item) => {
          ret.push(createSong(item))
        })
        return ret
    }
    render() {
        const { disc } = this.props;
        return (
            <div name="slide">
                <MusicList 
                    bgImage={disc.imgurl}
                    title={disc.dissname}
                    songs={this.state.songs}
                >
                </MusicList>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    disc: getDisc(state)
})

export default connect(mapStateToProps)(Disc)