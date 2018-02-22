import React, { Component } from 'react';
import ProbeTypes from 'prop-types';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getAttr } from 'common/js/dom';
import { is, fromJS } from 'immutable';
import './listview.less';
const AHCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default class ListView extends Component {
    state = {
        currentIndex: 0,
        scrollY: -1,
        diff: -1,
        shortcutList: [],
        fixedTitle: ''
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
                this.handleFixTitleChange(this.state.currentIndex)
            }, 20)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.currentIndex !== this.state.currentIndex) {
            this.handleFixTitleChange(nextState.currentIndex)
        }
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    createMarkup = (item) => {
		return {__html: item.name};
    }
    shortcutToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let anchorIndex = getAttr(e.target, 'index');
        anchorIndex = parseInt(anchorIndex, 10)

        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
    }
    stcToggleMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / AHCHOR_HEIGHT | 0
        let anchorIndex = this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
    }
    onTouchEnd = (e) => {
        e.stopPropagation();
        this.scrollToFlag = false
    }
    handleScroll = (pos) => {
        if (this.scrollToFlag ) {
            return;
        }
        this.setState({scrollY: pos.y})
        let { scrollY } = this.state;
        if (scrollY > 0) {
            this.setState({currentIndex: 0})
            return;
          }
          // 当在中部
          for (let i = 0; i < this.listHeight.length - 2; i++) {
            let height1 = this.listHeight[i]
            let height2 = this.listHeight[i + 1]
            if (-scrollY >= height1 && -scrollY < height2) {
              this.setState({currentIndex: i})
              this.diff = height2 + scrollY
              this.handleDiffChange(this.diff)
              return;
            }
          }
          // 当在底部
          this.setState({currentIndex: this.listHeight.length - 2})
          this.handleFixTitleChange(this.state.currentIndex)
    }
    handleDiffChange = (newVal) => {
        let offset = (newVal < TITLE_HEIGHT && newVal > 0) ? TITLE_HEIGHT - newVal : 0
        if (this.offset === offset) {
          return;
        }
        this.offset = offset
        this.topFixed.style.transform = `translate3d(0,${-offset}px,0)`
    }
    handleFixTitleChange = (currentIndex) => {
        let item = this.props.data[currentIndex];
        this.setState({fixedTitle: item ? item.title : ''})
    }
    refresh = () => {
        this.listview.refresh()
    }
    selectItem = (item) => {
        this.props.select(item)
    }
    _scrollTo = (index) => {
        if (index < 0) {
            index = 0
        } else if (index > this.listHeight.length - 2) {
            index = this.listHeight.length - 2
        }
        this.setState({currentIndex: index})
        
        // 设置导航滚动标志位，为真时阻止监听scroll组件的scroll事件的响应
        this.scrollToFlag = true

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
                                            <li
                                                className="list-group-item"
                                                key={id}
                                                onClick={()=>this.selectItem(item)}
                                            >
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
                {
                    this.state.scrollY < 0
                    ? (
                        <div className="list-fixed" ref={topFixed => this.topFixed = topFixed}>
                            <div className="fixed-title">{this.state.fixedTitle}</div>
                        </div>
                      )
                    : ''
                }
                <div
                    className="list-shortcut"
                    onTouchStart={this.shortcutToggle}
                    onTouchMove={this.stcToggleMove}
                    onTouchEnd={this.onTouchEnd}>
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