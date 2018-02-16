import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './loading.less';
import loadingImg from 'common/images/loading.gif'

export default class Loading extends Component {
    render() {
        return (
            <div className="loading">
                <img width="24" height="24" src={loadingImg} alt=""/>
                <p className="desc">{this.props.title}</p>
            </div>
        );
    }
}

Loading.protoTypes = {
    title: PropTypes.string
};

Loading.defaultProps = {
    title: "正在载入..."
}