import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';

export default class Scroll extends Component {
    componentDidMount = () => {
        this._initScroll();
    }
    _initScroll = () => {
        if (!this.wrapper) {
          return
        }
        this.scroll = new BScroll(this.wrapper, {
          probeType: this.props.probeType,
          click: this.props.click
        })
    }
    refresh = () => {
        this.scroll && this.scroll.refresh()
    }
    render() {
        return (
            <div ref={(wrapper) => {this.warpper = wrapper}}>
                {this.props.children}
            </div>
        );
    }
}

Scroll.propTypes = {
    probeType: PropTypes.number,
    click: PropTypes.bool,
    data: PropTypes.array
};

Scroll.defaultProps = {
    probeType: 1,
    click: true,
    data: []
}