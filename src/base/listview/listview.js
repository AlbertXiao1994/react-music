import React, { Component } from 'react';
import ProbeTypes from 'prop-types';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import './listview.less';

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
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            let arr = nextProps.data.map((group) => group.title.substr(0, 1));
            this.setState({shortcutList: arr})
        }
    }
    createMarkup = (item) => {
		return {__html: item.name};
    }
    render() {
        return (
            <Scroll
                className="listview"
                data={this.props.data}
                probeType={this.probeType}
                listen-scroll={this.listenScroll}
                ref={listview => this.listview = listview}
            >
                <ul>
                    {
                        this.props.data.map((group, index) => 
                            <li
                                key={index}
                                className="list-group"
                                ref={listGroup => this.listGroup = listGroup}
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