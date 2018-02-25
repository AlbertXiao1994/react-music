import React, { Component } from 'react';
import './suggest.less';
import { is, fromJS } from 'immutable';
import { getSearch } from 'api/search';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import NoResult from 'base/no-result/no-result';
import Singer from 'common/js/singer';

export default class Suggest extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}