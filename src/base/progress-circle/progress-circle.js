import React, { Component } from 'react';
import './progress-circle.less';
import PropTypes from 'prop-types';

export default class ProgressCircle extends Component {
    state = {
        dashOffset: this.dashArray
    }
    componentWillMount() {
        this.dashArray = Math.PI * 100
    }
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {};
        const thisState = this.state || {};
        nextState = nextState || {};
        nextProps = nextProps || {};

        if (nextProps.percent !== thisProps.percent) {
            this.setState({dashOffset: this.dashArray * (1 - nextProps.percent)})
        }

        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
            Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }

        for (const key in nextProps) {
            if (!Object.is(thisProps[key], nextProps[key])) {
                return true;
            }
        }

        for (const key in nextState) {
            if (!Object.is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    render() {
        const { radius, children } = this.props;
        return (
            <div className="progress-circle">
                <svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
                    <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" stroke-dasharray={this.dashArray} stroke-dashoffset={this.state.dashOffset}/>
                </svg>
                {children}
            </div>
        );
    }
}

ProgressCircle.propTypes = {
    radius: PropTypes.number,
    percent: PropTypes.number
}

ProgressCircle.defaultProps = {
    radius: 100,
    percent: 0
}