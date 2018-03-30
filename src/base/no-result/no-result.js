import React from 'react';
import PropTypes from 'prop-types';
import './no-result.less';

const NoResult = (props) => (
    <div className="no-result">
        <div className="no-result-icon"></div>
            <p className="no-result-text">{props.title}</p>
    </div>
)

NoResult.propTypes = {
    title: PropTypes.string
}

NoResult.defaultProps = {
    title: ''
}

export default NoResult;