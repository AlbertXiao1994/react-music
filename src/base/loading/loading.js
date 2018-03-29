import React from 'react';
import PropTypes from 'prop-types';
import './loading.less';
import loadingImg from 'common/images/loading.gif'

const Loading = (props) => (
    <div className="loading">
        <img width="24" height="24" src={loadingImg} alt=""/>
        <p className="desc">{props.title}</p>
    </div>
)

Loading.protoTypes = {
    title: PropTypes.string
};

Loading.defaultProps = {
    title: "正在载入..."
}

export default Loading;