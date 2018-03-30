import React from 'react';
import './switches.less';
import PropTypes from 'prop-types';

const Switches = (props) => {
    const { switches, currentIndex } = props;
    return (
        <ul className="switches">
        {
            switches.map((item, index) =>
                <li 
                    className={currentIndex===index?"switch-item active":"switch-item"} 
                    onClick={()=>props.select(index)}
                >
                    <span>{item.name}</span>
                </li>
            )
        }
        </ul>
    )
}

Switches.propTypes = {
    switches: PropTypes.array,
    currentIndex: PropTypes.number
}

Switches.defaultProps = {
    switches: [],
    currentIndex: 0
}

export default Switches;
            