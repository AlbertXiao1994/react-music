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
import PropTypes from 'prop-types';

export default class Suggest extends Component {
    state = {
        result: [],
        hasMore: false
    };
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render() {
        const { result, hasMore } = this.state;
        return (
            <Scroll 
                ref={scroll=>this.scroll=scroll}
                className="suggest"
                data={result}
                scrollToEnd="searchMore" 
                pullup="pullup"
                beforeScroll="listScroll"
                // :beforeScroll="beforeScroll"
            >
                <ul class="suggest-list">
                    {
                        result.map((item,index) => (
                                !(item.type&&index!==0)
                                ? <li className="suggest-item" onClick={()=>this.selectItem(item)}>
                                    <div className="icon">
                                        <i className="getIconCls(item)"></i>
                                    </div>
                                    <div className="name">
                                        <p className="text" dangerouslySetInnerHTML={()=>this.getText(item)}></p>
                                    </div>
                                  </li>
                                : ''
                            )
                        )
                    }
                    {hasMore ? <Loading /> : ''}
                </ul>
                {
                    !hasMore&&!result.length
                    ? <div className="no-result-wrapper">
                        <NoResult title="抱歉，暂无搜索结果"></NoResult>
                      </div>
                    : ''
                }
        </Scroll>
        );
    }
}

Suggest.propTypes = {
    query: PropTypes.string,
    showSinger: PropTypes.bool
}

Suggest.defaultProps = {
    query: '',
    showSinger: true
}