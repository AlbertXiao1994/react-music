import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import './progress-bar.less';
import {prefixStyle} from 'common/js/dom';
import PropTypes from 'prop-types';

const transform = prefixStyle('transform');
const BTN_WIDTH = 16;

export default class Progressbar extends Component {
    componentWillMount() {
        this.touch = {}
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    progressTourchStart = (e) => {
        e.preventDefault();
        this.touch.initialed = true
        this.touch.startX = e.touches[0].pageX
        this.touch.progress = this.progress.clientWidth
    }
    progressTourchMove = (e) => {
        e.preventDefault();
        if (!this.touch.initialed) {
          return
        }
        let delta = e.touches[0].pageX - this.touch.startX
        let offsetWidth = Math.min(this.progressBar.clientWidth - BTN_WIDTH, Math.max(0, this.touch.progress + delta))
        this._setOffset(offsetWidth)
    }
    progressTourchEnd = (e) => {
        e.preventDefault();
        this.touch.initialed = false
        this._triggerPercent()
    }
    straightToggle = (e) => {
        let rect = this.progressBar.getBoundingClientRect()
        let offsetWidth = e.pageX - rect.left
        this._setOffset(offsetWidth)
        this._triggerPercent()
    }
    _triggerPercent = () => {
        let barWidth = this.progressBar.clientWidth - BTN_WIDTH
        let percent = this.progress.clientWidth / barWidth
        this.props.changePercent(percent)
    }
    _setOffset = (offset) => {
        this.progress.style.width = `${offset}px`
        this.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`
    }
    render() {
        return (
            <div
                className="progress-bar"
                ref={progressBar=>this.progressBar=progressBar}
                onClick={this.straightToggle}
            >
                <div className="bar-inner">
                    <div className="progress" ref={progress=>this.progress=progress}></div>
                    <div 
                        className="progress-btn-wrapper"
                        ref={progressBtn=>this.progressBtn=progressBtn}
                        onTouchStart={this.progressTourchStart}
                        onTouchMove={this.progressTourchMove}
                        onTouchEnd={this.progressTourchEnd}
                    >
                        <div className="progress-btn"></div>
                    </div>
                </div>
            </div>
        );
    }
}

Progressbar.propTypes = {
    percent: PropTypes.number
}

Progressbar.defaultProps = {
    percent: 0
}