import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { OidcProvider } from 'redux-oidc';
import { Router, browserHistory, Route, IndexRoute } from 'react-router'

import createOidcMiddleware from 'redux-oidc';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk';

import userManager from '../userManager';

import Root from '../root/Root';
import Home from '../home/Home';
import About from '../about/About';
import OidcCallback from '../oidcCallback/OidcCallback';
import Help from '../help/Help';
import Settings from '../settings/Settings';
import Tabs from '../tabs/Tabs';

import okihome from '../reducers'

const logger = createLogger();
  
  // create the middleware with the userManager, null for shouldValidate, triggerAuthFlow false, and the callback route registered with react-router-redux
const oidcMiddleware = createOidcMiddleware(userManager, null, false, '/callback')

// Add the reducer to the store on the `routing` key
const store = createStore(
  okihome,
  applyMiddleware(thunk, oidcMiddleware, logger, routerMiddleware(browserHistory))
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <OidcProvider store={store} userManager={userManager}>
          <Router history={history}>
            <Route path="/" component={Root}>
                <IndexRoute component={Home}/>
                <Route path="callback" component={OidcCallback}/>
                <Route path="about" component={About}/>
                <Route path="help" component={Help}/>
                <Route path="settings" component={Settings}/>
                <Route path="tabs/:tabId" component={Tabs}/>
            </Route>
          </Router>
        </OidcProvider>
      </Provider>
    );
  }
}

export default App;
