import React, { Component } from 'react';
import ProbeTypes from 'prop-types';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getAttr } from 'common/js/dom';
import './listview.less';
const AHCHOR_HEIGHT = 18;
// const TITLE_HEIGHT = 30;

export default class ListView extends Component {
    state = {
        currentIndex: 0,
        scrollY: -1,
        diff: -1,
        shortcutList: []
    };
    componentWillMount() {
        this.listHeight = []
        this.touch = {}
        this.listenScroll = true
        this.probeType = 3
        this.listGroup = []
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            let arr = nextProps.data.map((group) => group.title.substr(0, 1));
            this.setState({shortcutList: arr})
            setTimeout(() => {
                this._calListHeight()
            }, 20)
            // console.log(this.listHeight)
        }
    }
    createMarkup = (item) => {
		return {__html: item.name};
    }
    shortcutToggle = (e) => {
        let anchorIndex = getAttr(e.target, 'index');
        anchorIndex = parseInt(anchorIndex, 10)

        this.setState({currentIndex: anchorIndex})
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
    }
    stcToggleMove = (e) => {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / AHCHOR_HEIGHT | 0
        let anchorIndex = this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
    }
    handleScroll = (pos) => {
        this.setState({scrollY: pos.y})
        let { scrollY } = this.state;
        if (scrollY > 0) {
            this.setState({currentIndex: 0})
            // console.log(this.state.currentIndex)
            return;
          }
          // 当在中部
          for (let i = 0; i < this.listHeight.length - 2; i++) {
            let height1 = this.listHeight[i]
            let height2 = this.listHeight[i + 1]
            if (-scrollY >= height1 && -scrollY < height2) {
              this.setState({currentIndex: i})
            //   console.log(this.state.currentIndex)
            //   this.diff = height2 + scrollY
              return;
            }
          }
          // 当在底部
          this.setState({currentIndex: this.listHeight.length - 2})
        //   console.log(this.state.currentIndex)
    }
    refresh = () => {
        this.listview.refresh()
    }
    _scrollTo = (index) => {
        if (index < 0) {
            index = 0
        } else if (index > this.listHeight.length - 2) {
            index = this.listHeight.length - 2
        }
        this.setState({currentIndex: index})
        this.listview.scrollToElement(this.listGroup[index], 400)
    }
    _calListHeight = () => {
        this.listHeight = []
        const list = this.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
            height += list[i].clientHeight
            this.listHeight.push(height)
        }
    }
    render() {
        return (
            <Scroll
                className="listview"
                data={this.props.data}
                scroll={this.handleScroll}
                probeType={this.probeType}
                listenScroll={this.listenScroll}
                ref={listview => this.listview = listview}
            >
                <ul>
                    {
                        this.props.data.map((group, index) => 
                            <li
                                key={index}
                                className="list-group"
                                ref={(listGroup) => {this.listGroup.push(listGroup)}}
                            >
                                <h2 className="list-group-title">{group.title}</h2>
                                <ul>
                                    {
                                        group.items.map((item, id) =>
                                            <li className="list-group-item" key={id}>
                                                <img className="avatar" src={item.avatar_s} alt="" />
                                                <span className="name" dangerouslySetInnerHTML={this.createMarkup(item)}></span>
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                        )
                    }
                </ul>
                <div className="list-shortcut">
                    <ul>
                        {
                            this.state.shortcutList.map((item, index) =>
                                <li 
                                    className={this.state.currentIndex===index?'item current':'item'}
                                    data-index={index}
                                    key={index}
                                >{item}
                                </li>
                            )
                        }
                    </ul>
                </div>
                <div className="loading-container">
                    {
                        !this.props.data.length
                        ? <Loading />
                        : ''
                    }
                </div>
            </Scroll>
        );
    }
}

ListView.probeTypes = {
    data: ProbeTypes.array
};

ListView.defaultProps = {
    data: []
}