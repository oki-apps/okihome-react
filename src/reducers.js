import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as oidcReducer} from 'redux-oidc';

import * as user from './reducers/user'
import * as tabs from './reducers/tabs'
import * as version from './reducers/version'
import * as feeds from './reducers/feeds'

const okihome = combineReducers({
  user: user.reducer,
  tabs: tabs.reducer,
  feeds: feeds.reducer,
  apiVersion: version.reducer,
  routing: routerReducer,
  oidc: oidcReducer,
})

export const getUserId = (state) => state && state.oidc && state.oidc.user && state.oidc.user.profile ? state.oidc.user.profile.sub : null;
export const getAllTabs = (state) => state ? tabs.getAll(state.tabs) : [];
export const getTab = (state, tabId) => state ? tabs.getTab(state.tabs, tabId) : state;
export const getTabWidgets = (state, tabId) => state ? tabs.getWidgets(state.tabs, tabId) : [];
export const getApiVersion = (state) => state ? version.getVersion(state.apiVersion) : state;
export const isFetchingApiVersion = (state) => state ? version.getIsFetching(state.apiVersion) : state;
export const getFeedItems = (state, userId, feedId) => state ? feeds.getItems(state.feeds, userId, feedId) : [];


export default okihome