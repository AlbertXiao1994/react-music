import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './m-header.less';

export default class MHeader extends Component {
    render() {
        return (
            <div className="m-header">
                <div className="icon"></div>
                <h1 className="text">Albert Music</h1>
                <Link to="/user" className="mine">
                    <i class="icon-mine" />
                </Link>
            </div>
        );
    }
}