import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './m-header.less';
import { is, fromJS } from 'immutable';

export default class MHeader extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render() {
        return (
            <div className="m-header">
                <div className="icon"></div>
                <h1 className="text">Albert Music</h1>
                <Link to="/user" className="mine">
                    <i className="icon-mine" />
                </Link>
            </div>
        );
    }
}