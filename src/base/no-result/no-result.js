import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import './no-result.less';

export default class NoResult extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render() {
        return (
            <div className="no-result">
                <div className="no-result-icon"></div>
                <p className="no-result-text">{this.props.title}</p>
            </div>
        );
    }
}

NoResult.propTypes = {
    title: PropTypes.string
}

NoResult.defaultProps = {
    title: ''
}