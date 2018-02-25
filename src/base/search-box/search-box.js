import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import {debounce} from 'common/js/util'

export default class SearchBox extends Component {
    state = {
        query: ''
    }
    componentWillReceiveProps(nextProps) {
        debounce((newVal) => {
            this.props.queryChange(newVal)
          }, 200)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    clear() {
        this.setState({query: ''})
    }
    setQuery(newVal) {
        this.setState({query: newVal})
    }
    blur() {
        this.input.blur()
    }
    render() {
        return (
            <div className="search-box">
                <i className="icon-search"></i>
                <input 
                    ref={input=>this.input=input}
                    class="box"
                    value="query"
                    placeholder="placeholder"
                />
                {
                    this.state.query
                    ? <i className="icon-dismiss" onClick={this.clear}></i>
                    : ''
                }
            </div>
        );
    }
}

SearchBox.propTypes = {
    placeholder: PropTypes.string
};

SearchBox.defaultProps = {
    placeholder: '搜索歌曲、歌手'
}