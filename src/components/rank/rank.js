import React, { Component } from 'react';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getTopList } from 'api/rank';
import { is, fromJS } from 'immutable';
import './rank.less';
import { Route } from 'react-router-dom';
import TopList from 'components/top-list/top-list';
import { connect } from 'react-redux';
import { setTopList } from '@/store/actions';

class Rank extends Component {
    state = {
        topList: []
    };
    componentWillMount() {
        this._getTopList()
    }
    selectItem = (item) => {
        this.props.history.push(`/rank/${item.topID}`)
        this.props.setTopList(item)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    _getTopList() {
        getTopList().then((res) => {
          this.setState({topList: res[0].List})
        }, (err) => {
          console.log(err)
        })
    }
    render() {
        return (
            <div className="rank" ref={rank => this.rank = rank}>
                <Route path={`${this.props.match.url}/:id`} component={TopList} />
                <Route
                    exact
                    path={this.props.match.url}
                    render={() => 
                        <Scroll 
                            className="toplist"
                            ref={topList => this.topList = topList}
                            data={this.state.topList}>
                            <ul>
                                {
                                    this.state.topList.map((list, id) =>
                                        list.topID!==201
                                        ? (<li className="item" onClick={()=>this.selectItem(list)} key={id}>
                                            <div className="icon">
                                                <img src={list.pic_v12} width="100" height="100" alt=""/>
                                            </div>
                                            <ul className="songlist">
                                                {
                                                    list.songlist.map((song, index) =>
                                                        index < 3
                                                        ? <li className="song" key={index}>
                                                            <span>{index+1}</span>
                                                            <span>{song.songname}-{song.singername}</span>
                                                        </li>
                                                        : ''
                                                    )
                                                }
                                            </ul>
                                        </li>)
                                        : ''
                                    )
                                }
                            </ul>
                            {
                                !this.state.topList.length
                                ? <div className="loading-container">
                                    <Loading /> 
                                </div>
                                : ''
                            }
                        </Scroll>
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = () => ({})

const mapDispatchToProps =  {
  setTopList
}

export default connect(mapStateToProps, mapDispatchToProps)(Rank)