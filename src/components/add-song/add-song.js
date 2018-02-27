import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import './add-song.less';
import Scroll from 'base/scroll/scroll';
import Suggest from 'components/suggest/suggest';
import SearchBox from 'base/search-box/search-box';
import SearchList from 'base/search-list/search-list';
import SongList from 'base/song-list/song-list';
import Switches from 'base/switches/switches';
import TopTip from 'base/top-tip/top-tip';
import Song from 'common/js/song';

export default class AddSong extends Component {
    state = {
        query: '',
        showFlag: false,
        showSinger: false,
        currentIndex: 0
    }
    componentWillMount() {
        this.switches= [
            {name: '播放历史'},
            {name: '搜索历史'}
          ]
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
    }
    hide = () => {
        this.setState({showFlag: false})
    }
    toggleIndex = (index) => {
        this.setState({currentIndex: index})
    }
    selectFromSuggest = (song) => {
        this.topTip.show()
        this.props.saveSearchHistory(this.state.query)
    }
    selectFromPlay = (song, index) => {
        if (index !== 0) {
          this.props.insertSong(new Song(song))
          this.topTip.show()
        }
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
    render() {
        return (
            <div name="slide">
            {
                this.state.showFlag
                ? <div className="add-song" onClick={(e)=>e.stopPropagation()}>
                    <div className="header">
                        <h1 className="title">添加歌曲到列表</h1>
                        <div className="close" onClick={this.hide}>
                            <i className="icon-close"></i>
                        </div>
                    </div>
                    <div className="search-box-wrapper">
                        <SearchBox placeholder="搜索歌曲" queryChange={this.onQueryChange} ref={searchBox=>this.searchBox=searchBox}></SearchBox>
                    </div>
                    {
                        !this.state.query
                        ? <div className="shortcut">
                            <Switches switches={this.switches} currentIndex={this.state.currentIndex} select={this.toggleIndex}></Switches>
                            <div className="list-wrapper">
                            {
                                this.state.currentIndex===0
                                ? <Scroll className="list-scroll" data={this.props.playHistory} v-show="currentIndex===0" ref={songList=>this.songList=songList}>
                                    <div className="list-inner">
                                    <SongList songs={this.props.playHistory} select={this.selectFromPlay}></SongList>
                                    </div>
                                  </Scroll>
                                : ''
                            }
                            {

                            }
                                this.state.currentIndex===1
                                ? <Scroll className="list-scroll" data={this.props.searchHistory} ref={searchList=>this.searchList=searchList}>
                                    <div className="list-inner">
                                    <SearchList history={this.props.searchHistory} select={this.addQuery} delete={this.props.deleteSearchHistory}></SearchList>
                                    </div>
                                  </Scroll>
                                : ''
                            </div>
                          </div>
                        : ''
                    }
                    {
                        this.state.query
                        ? <div className="search-result">
                            <Suggest 
                                query={this.state.query}
                                listScroll={this.blurInput}
                                ref={suggest=>this.suggest=suggest}
                                select={this.selectFromSuggest}
                                showSinger={this.state.showSinger}>
                            </Suggest>
                         </div>
                        : ''
                    }
                    <TopTip ref={topTip=>this.topTip=topTip}>
                        <div className="tip-title">
                            <i className="icon-ok"></i>
                            <span className="text">1首歌曲已经添加到播放列表</span>
                        </div>
                    </TopTip>
                  </div>
                : ''
            }
            </div>
        );
    }
}