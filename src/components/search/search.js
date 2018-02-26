import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { Route } from 'react-router-dom';
import './search.less';
import SingerDetail from 'components/singer-detail/singer-detail';
import SearchBox from 'base/search-box/search-box';
import { getHotKey } from 'api/search';
import { ERR_OK } from 'api/config';
import Suggest from 'components/suggest/suggest';
import Scroll from 'base/scroll/scroll';
import SearchList from 'base/search-list/search-list';
import Confirm from 'base/confirm/confirm';
import { connect } from 'react-redux';
import { handleSearchHistory } from '@/store/actions';
import { saveSearch, clearSearch, deleteSearch } from 'common/js/cache';
import { getSearchHistory } from '@/store/reducers';

class Search extends Component {
    state = {
        query: '',
        hotKey: []
    }
    componentDidMount() {
        this._getHotKeys()
    }
    shouldComponentUpdate(nextProps, nextState) {
        // if (nextState.hotKey !== this.state.hotKey) {
        //     this.setState({shortcut: nextState.hotKey.concat(this.props.searchHistory)})
        // }
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    confirmClear = () => {
        this.confirm.show()
    }
    onQueryChange = (newVal) => {
        this.setState({query: newVal})
    }
    addQuery = (key) => {
        this.searchBox.setQuery(key)
    }
    blurInput = () => {
        this.searchBox.blur()
    }
    _getHotKeys = () => {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.setState({hotKey: res.data.hotkey.slice(0, 10)})
          }
        })
    }
    render() {
        return (
           <div className="search">
               <Route path={`${this.props.match.url}/:singerId`} component={SingerDetail} />
                <Route
                    exact
                    path={this.props.match.url}
                    render={() => 
                        <div>
                            <div className="search-box-wrapper">
                                <SearchBox 
                                    ref={searchBox=>this.searchBox=searchBox}
                                    queryChange={this.onQueryChange}
                                />
                            </div>
                            {
                                !this.state.query
                                ? <div className="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
                                    <Scroll
                                        className="shortcut"
                                        ref={shortcut=>this.shortcut=shortcut}
                                        // data={this.state.shortcut}
                                    >
                                        <div>
                                            <div className="hot-key">
                                            <h1 className="title">热门搜索</h1>
                                                <ul>
                                                    {
                                                        this.state.hotKey.map((item, index) =>
                                                        <li
                                                            onClick={()=>this.addQuery(item.k)}
                                                            className="item"
                                                            key={index}
                                                        >
                                                            <span>{item.k}</span>
                                                        </li>  
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                            {
                                                this.props.searchHistory.length
                                                ? <div className="search-history">
                                                    <h1 className="title">
                                                        <span className="text">搜索历史</span>
                                                        <span className="clear" onClick={this.confirmClear}>
                                                            <i className="icon-clear"></i>
                                                        </span>
                                                    </h1>
                                                    <SearchList 
                                                        history={this.props.searchHistory}
                                                        select={this.addQuery}
                                                        // delete={this.deleteSearchHistory}
                                                    >
                                                    </SearchList>
                                                </div>
                                                : ''
                                            }
                                        </div>
                                    </Scroll>
                                </div>
                                : ''
                            }
                            {
                                this.state.query
                                ? <div className="search-result" ref={searchResult=>this.searchResult=searchResult}>
                                    <Suggest
                                        query={this.state.query}
                                        listScroll={this.blurInput}
                                        ref={suggest=>this.suggest=suggest}
                                        select={()=>this.props.saveSearchHistory(this.state.query)}
                                    >
                                    </Suggest>
                                </div>
                                : ''
                            }
                            <Confirm
                                text="确认清空所有搜索历史"
                                confirmBtnText="清空"
                                ref={confirm=>this.confirm=confirm}
                                // confirm={this.props.clearSearchHistory}
                            >
                            </Confirm>
                        </div>
                    }
                />
           </div>
        );
    }
}

const mapStateToProps = (state) => ({
    searchHistory: getSearchHistory(state)
})

const mapDispatchToProps =  {
    saveSearchHistory: (query) => {
        let searchHistory = saveSearch(query)
        console.log(searchHistory)
        handleSearchHistory(searchHistory)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)