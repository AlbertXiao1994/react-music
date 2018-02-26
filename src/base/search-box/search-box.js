import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import { debounce } from 'common/js/util';
import './search-box.less';

export default class SearchBox extends Component {
    state = {
        query: ''
    }
    componentWillMount() {
        this.debounce = debounce((newVal) => {
            this.props.queryChange(newVal)
          }, 200)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.query !== this.state.query) {
            this.debounce(nextState.query)
        }
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    clear = () => {
        this.setState({query: ''})
    }
    setQuery = (newVal) => {
        this.setState({query: newVal})
    }
    handleInput = (e) => {
        this.setState({query: e.target.value})
    }
    blur = () => {
        this.input.blur()
    }
    render() {
        return (
            <div className="search-box">
                <i className="icon-search"></i>
                <input 
                    ref={input=>this.input=input}
                    className="box"
                    value={this.state.query}
                    placeholder={this.props.placeholder}
                    onChange={this.handleInput}
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