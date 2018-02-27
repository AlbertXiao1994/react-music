import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
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
        if (nextProps.percent !== this.props.percent) {
            this.setState({dashOffset: this.dashArray * (1 - nextProps.percent)})
        }
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render() {
        const { radius} = this.props;
        return (
            <div className="progress-circle">
                <svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
                    <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" stroke-dasharray={this.dashArray} stroke-dashoffset={this.state.dashOffset}/>
                </svg>
                {this.props.children}
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