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

const PER_PAGE = 20;
const TYPE_SINGER = 'singer';

export default class Suggest extends Component {
    state = {
        pageNum: 1,
        result: [],
        hasMore: true,
        pullup: true,
        beforeScroll: true
    };
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    search(query) {
        getSearch(query, PER_PAGE, this.state.pageNum, this.props.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.setState({result: this.result.concat(this._normalize(res.data))})
            this._checkMore(res.data)
          }
        })
    }
    searchMore() {
        if (!this.state.hasMore) {
          return;
        }
        this.setState((prevState, props) => ({
            pageNum: prevState.pageNum + 1
        }));
        this.search(this.props.query)
    }
    getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
    }
    getText(item) {
        if (item.type === TYPE_SINGER) {
          return {__html:item.singername};
        } else {
          return {__html:`${item.name}-${item.singer}`};
        }
    }
    listScroll() {
        this.props.listScroll()
    }
    selectItem(item) {
        if (item.type === TYPE_SINGER) {
          let singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.props.history.push( `/search/${singer.id}`)
          this.setSinger(singer)
        } else {
        //   this.insertSong(item)
        }
        this.props.select(item)
    }
    refresh() {
        this.scroll.refresh()
    }
    _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum * song.curpage) >= song.totalnum) {
          this.setState({hasMore: false})
        }
    }
    _normalize(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        return ret.concat(this._normalizeSongs(data.song.list));
    }
    _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          ret.push(createSong(musicData))
        })
        return ret;
    }
    render() {
        const { result, hasMore } = this.state;
        return (
            <Scroll 
                ref={scroll=>this.scroll=scroll}
                className="suggest"
                data={result}
                scrollToEnd={this.searchMore}
                pullup={this.state.pullup}
                beforeScroll={this.listScroll}
                beforeScrollProp={this.state.beforeScroll}
            >
                <ul class="suggest-list">
                    {
                        result.map((item,index) => (
                                !(item.type&&index!==0)
                                ? <li className="suggest-item" onClick={()=>this.selectItem(item)}>
                                    <div className="icon">
                                        <i className={this.getIconCls(item)}></i>
                                    </div>
                                    <div className="name">
                                        <p className="text" dangerouslySetInnerHTML={this.getText(item)}></p>
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
};

Suggest.defaultProps = {
    query: '',
    showSinger: true
};