import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Recommend from 'components/recommend/recommend';
import Singer from 'components/singer/singer';
import Rank from 'components/rank/rank';
import Search from 'componentssearch/search';

export default class RouterConfig extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Recommend} />
                <Route path="/recommend" component={Singer} />
                <Route path="/singer" component={Singer} />
                <Route path="/rank" component={Rank} />
                <Route path="/search" component={Search} />
            </Router>
        );
    }
}