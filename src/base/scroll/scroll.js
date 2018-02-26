import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import { is, fromJS } from 'immutable';

export default class Scroll extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            setTimeout(() => {
                if (!this.scroll) {
                    this._initScroll()
                }
                this.refresh()
              }, this.props.refreshDelay)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
    refresh = () => {
        this.scroll && this.scroll.refresh()
    }
    scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
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
              _this.props.scroll(pos)
            })
        }

        if (this.props.pullup) {
            let _this = this
            this.scroll.on('scrollEnd', () => {
              if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                _this.props.scrollToEnd()
              }
            })
        }
  
        if (this.props.beforeScrollProp) {
            let _this = this
            this.scroll.on('beforeScrollStart', () => {
                _this.props.beforeScroll()
            })
        }
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
    beforeScrollProp: PropTypes.bool,
    style: PropTypes.object
};

Scroll.defaultProps = {
    probeType: 1,
    click: true,
    data: [],
    refreshDelay: 20,
    listenScroll: false,
    pullup: false,
    beforeScrollProp: false,
    style: {}
}