import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Recommend from 'components/recommend/recommend';
import Singer from 'components/singer/singer';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';

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
        </div>
    </Router>
    );
  }
}

export default App;
