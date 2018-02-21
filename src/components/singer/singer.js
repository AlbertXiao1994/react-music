import React, { Component } from 'react';
import ListView from 'base/listview/listview';
import { getSingerList } from 'api/singer';
import { ERR_OK } from 'api/config';
import Singer from 'common/js/singer';
import './singer.less';
import { Route } from 'react-router-dom';
import SingerDetail from 'components/singer-detail/singer-detail';
import createHistory from "history/createBrowserHistory";

const history = createHistory();
const HOT_NAME = '热门';
const HOT_LEN = 10;

export default class SingerComp extends Component {
    state = {
        singers: []
    };
    componentWillMount() {
        this._getSingerList()
    }
    selectSinger(singer) {
        history.push({
          path: `/singer/${singer.id}`
        })
        // this.setSinger(singer)
    }
    _getSingerList = () => {
        getSingerList().then((res) => {
            if (res.code === ERR_OK) {
                this.setState({singers: this._normalizeSinger(res.data.list)})
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
                <ListView
                    data={this.state.singers}
                    ref={list => this.list = list}
                    select={this.selectSinger}
                >
                </ListView>
                <Route path={`${this.props.match.url}/:Id`} component={SingerDetail} />
            </div>
        );
    }
}