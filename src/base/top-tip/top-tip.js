import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';

export default class TopTip extends Component {
    state = {
        showFlag: false
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    show = () => {
        this.setState({showFlag: true})
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, this.props.delay)
    }
    hide = (e) => {
        this.setState({showFlag: false})
    }
    render() {
        return (
            <div name="drop">
            {
                this.state.showFlag
                ? <div className="top-tip" onClick={this.hide}>
                    this.props.children
                  </div>
                : ''
            }
            </div>
        );
    }
}

TopTip.propTypes = {
    delay: PropTypes.number
};

TopTip.defaultProps = {
    delay: 2000
};