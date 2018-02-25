import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import './search.less';

export default class Search extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render() {
        return (
           <div>
               search
           </div> 
        );
    }
}