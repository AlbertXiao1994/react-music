import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';

export default class Scroll extends Component {
    componentDidMount = () => {
        this._initScroll();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            setTimeout(() => {
                this._initScroll();
                this.refresh()
              }, this.props.refreshDelay)
        }
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
            <div className={this.props.className} ref={(wrapper) => {this.wrapper = wrapper}}>
                {this.props.children}
            </div>
        );
    }
}

Scroll.propTypes = {
    probeType: PropTypes.number,
    click: PropTypes.bool,
    data: PropTypes.array,
    refreshDelay: PropTypes.number,
    listenScroll: PropTypes.bool,
    pullup: PropTypes.bool,
    beforeScroll: PropTypes.bool
};

Scroll.defaultProps = {
    probeType: 1,
    click: true,
    data: [],
    refreshDelay: 20,
    listenScroll: false,
    pullup: false,
    beforeScroll: false
}