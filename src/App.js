import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, browserHistory, Route, IndexRoute } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

import Home from './Home';
import About from './About';
import Help from './Help';
import Base from './Base';
import Private from './Private';
import Settings from './Settings';
import Tabs from './Tabs';

import okihome from './reducers'

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

// Add the reducer to the store on the `routing` key
let store = createStore(
  okihome,
  applyMiddleware(logger, routerMiddleware(browserHistory))
)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={Base}>
              <IndexRoute component={Home}/>
              <Route path="about" component={About}/>
              <Route path="help" component={Help}/>
              <Route path="private" component={Private}>
                <Route path="settings" component={Settings}/>
                <Route path="tabs/:tabId" component={Tabs}/>
              </Route>
          </Route>
        </Router>
      </Provider>
    );
  }
}

export default App;
