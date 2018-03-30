import React from 'react';
import { Link } from 'react-router-dom';
import './m-header.less';

const MHeader = () => (
    <div className="m-header">
        <div className="icon"></div>
            <h1 className="text">Albert Music</h1>
            <Link to="/user" className="mine">
                <i className="icon-mine" />
            </Link>
    </div>
)

export default MHeader;