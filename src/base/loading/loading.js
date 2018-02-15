import React, { Component } from 'react';
import './loading.less';

export default class Loading extends Component {
    render() {
        return (
            <div className="loading">
                <img width="24" height="24" src="./loading.gif" alt=""/>>
                <p class="desc">{this.props.title}</p>
            </div>
        );
    }
}