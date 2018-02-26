import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import './confirm.less';

export default class Confirm extends Component {
    state = {
        confirmShow: false 
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    show() {
        this.setState({confirmShow: true})
    }
    hide() {
        this.setState({confirmShow: false})
    }
    cancel() {
        this.hide()
    }
    confirm() {
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
                            <div className="operate-btn left" onClick={this.cancel}>{this.props.cancelBtnTex}}</div>
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