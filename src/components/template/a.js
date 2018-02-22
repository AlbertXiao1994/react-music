import React, { Component } from 'react';
import { is, fromJS } from 'immutable';

export default class A extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}