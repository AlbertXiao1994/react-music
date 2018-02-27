import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import './switches.less';
import PropTypes from 'prop-types';

export default class Switches extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    selectItem = (index) => {
        this.props.select(index)
    }
    render() {
        const { switches, currentIndex } = this.props;
        return (
            <ul className="switches">
            {
                switches.map((item, index) =>
                    <li 
                        className={currentIndex===index?"switch-item active":"switch-item"} 
                        onClick={()=>this.selectItem(index)}
                    >
                        <span>{item.name}</span>
                    </li>
                )
            }
            </ul>
        );
    }
}

Switches.propTypes = {
    switches: PropTypes.array,
    currentIndex: PropTypes.number
}

Switches.defaultProps = {
    switches: [],
    currentIndex: 0
}
            