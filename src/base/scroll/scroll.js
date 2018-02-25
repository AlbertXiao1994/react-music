import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import { is, fromJS } from 'immutable';

export default class Scroll extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            setTimeout(() => {
                this._initScroll()
                this.refresh()
              }, this.props.refreshDelay)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    handleScroll = (pos) => {
        this.props.scroll(pos)
    }
    scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
    _initScroll = () => {
        if (!this.wrapper) {
          return
        }
        this.scroll = new BScroll(this.wrapper, {
          probeType: this.props.probeType,
          click: this.props.click
        })

        if (this.props.listenScroll) {
            let _this = this
            this.scroll.on('scroll', (pos) => {
              _this.handleScroll(pos)
            })
          }  
    }
    refresh = () => {
        this.scroll && this.scroll.refresh()
    }
    render() {
        return (
            <div
                className={this.props.className}
                ref={(wrapper) => {this.wrapper = wrapper}}
                style={this.props.style}
            >
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