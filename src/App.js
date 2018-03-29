import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Recommend from 'components/recommend/recommend';
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';
import Player from 'components/player/player';
import asyncComponent from 'components/AsyncComponent';

const Singer = asyncComponent(() => import("components/singer/singer"));
const Rank = asyncComponent(() => import("components/rank/rank"));
const Search = asyncComponent(() => import("components/search/search"));

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <MHeader />
          <Tab />
          <Switch>
            <Route path="/" exact render={() => (
              <Redirect to="/recommend" />
            )} />
            <Route path="/recommend" component={Recommend} />
            <Route path="/singer" component={Singer} />
            <Route path="/rank" component={Rank} />
            <Route path="/search" component={Search} />
          </Switch>
          <Player />
        </div>
    </Router>
    );
  }
}

export default App;
