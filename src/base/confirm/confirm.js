import React, { PureComponent } from 'react';
import './confirm.less';
import PropTypes from 'prop-types';

export default class Confirm extends PureComponent {
    state = {
        confirmShow: false 
    }
    show = () => {
        this.setState({confirmShow: true})
    }
    hide = () => {
        this.setState({confirmShow: false})
    }
    cancel = () => {
        this.hide()
    }
    confirm = () => {
        this.props.confirm()
        this.hide()
    }
    render() {
        return (
            <div>
            {
                this.state.confirmShow
                ? <div 
                    className="confirm"
                    onClick={(e)=>{e.stopPropagation()}}
                  >
                    <div className="confirm-wrapper">
                        <div className="confirm-content">
                        <p className="text">{this.props.text}</p>
                        <div className="operate">
                            <div className="operate-btn left" onClick={this.cancel}>{this.props.cancelBtnText}</div>
                            <div className="operate-btn" onClick={this.confirm}>{this.props.confirmBtnText}</div>
                        </div>
                        </div>
                    </div>
                 </div>
                : ''
            }
            </div>
        );
    }
}

Confirm.propTypes = {
    text: PropTypes.string,
    cancelBtnTex: PropTypes.string,
    confirmBtnText: PropTypes.string
};

Confirm.defaultProps = {
    text: '',
    cancelBtnText: '取消',
    confirmBtnText: '确定'
}