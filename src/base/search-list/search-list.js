import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import './search-list.less';
import PropTypes from 'prop-types';

export default class SearchList extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps));
    }
    selectItem = (item) => {
        this.props.select(item)
    }
    deleteItem = (e, item) => {
        e.stopPropagation();
        this.props.delete(item)
    }
    render() {
        return (
            <div className="search-list">
            {
                this.props.history.length
                ? <ul>
                    {
                        this.props.history.map((item, index) =>
                            <li key={index} className="search-item" onClick={()=>this.selectItem(item)}>
                                <span className="text">{item}</span>
                                <span className="icon" onClick={(e)=>this.deleteItem(e, item)}>
                                    <i className="icon-delete"></i>
                                </span>
                            </li>
                        )
                    }
                  </ul>
                : ''
            }
            </div>
        );
    }
}

SearchList.propTypes = {
    history: PropTypes.array
};

SearchList.defaultProps = {
    history: []
}