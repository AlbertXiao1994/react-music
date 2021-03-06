import React, { Component } from 'react';
import ListView from 'base/listview/listview';
import { getSingerList } from 'api/singer';
import { ERR_OK } from 'api/config';
import Singer from 'common/js/singer';
import './singer.less';
import { Route } from 'react-router-dom';
import SingerDetail from 'components/singer-detail/singer-detail';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { setSinger } from '@/store/actions';
import { saveData, loadData, deleteData } from 'common/js/cache';

const HOT_NAME = '热门';
const HOT_LEN = 10;

class SingerComp extends Component {
    state = {
        singers: loadData()
    };
    componentWillMount() {
        if (!this.state.singers.length) {
            this._getSingerList()
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentWillUnmount() {
        deleteData()
    }
    selectSinger = (singer) => {
        this.props.history.push(`/singer/${singer.id}`)
        this.props.setSinger(singer)
    }
    _getSingerList = () => {
        getSingerList().then((res) => {
            if (res.code === ERR_OK) {
                this.setState({singers: this._normalizeSinger(res.data.list)})
                saveData(this.state.singers)
            }
        }, (err) => {
            console.log(err)
        })
    }
    _normalizeSinger = (list) => {
        let map = {
            hot: {
                title: HOT_NAME,
                items: []
            }
        }
        list.forEach((item, index) => {
            if (index < HOT_LEN) {
                map.hot.items.push(new Singer({
                    id: item.Fsinger_mid,
                    name: item.Fsinger_name
                }))
            }
            let key = item.Findex
            if (!map[key]) {
                map[key] = {
                    title: key,
                    items: []
                }
            }
            map[key].items.push(new Singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
            }))
        })
        // 得到有序列表
        let hot = []
        let rest = []
        for (let key in map) {
            let val = map[key]
            let reg = new RegExp('[a-zA-Z]')
            if (reg.test(val.title)) {
                rest.push(val)
            } else if (val.title === HOT_NAME) {
                hot.push(val)
            }
        }
        rest.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(rest);
    }
    render() {
        return (
            <div className="singer" ref={singer => this.singer = singer}>
                <Route path={`${this.props.match.url}/:singerId`} component={SingerDetail} />
                <Route
                    exact
                    path={this.props.match.url}
                    render={() =>
                        <ListView
                            data={this.state.singers}
                            ref={list => this.list = list}
                            select={this.selectSinger}
                        >
                        </ListView>
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = () => ({})

const mapDispatchToProps =  {
    setSinger
}

export default connect(mapStateToProps, mapDispatchToProps)(SingerComp)