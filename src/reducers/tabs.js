import { combineReducers } from 'redux'

import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';
import { FETCH_USER_SUCCESS, FETCH_USER_FAILURE } from '../actions'
import { FETCH_TAB_SUCCESS, FETCH_TAB_FAILURE, FETCH_TAB_REQUEST } from '../actions'
import { ADD_TAB_SUCCESS } from '../actions'
import { UPDATE_TAB_SUCCESS } from '../actions'
import { DELETE_TAB_SUCCESS } from '../actions'
import { UPDATE_WIDGETCONFIG_SUCCESS } from '../actions'
import { ADD_WIDGET_SUCCESS } from '../actions'
import { DELETE_WIDGET_SUCCESS } from '../actions'
import { SAVE_TABLAYOUT_SUCCESS } from '../actions'

function tabsConfig(state = [], action) {
  switch (action.type) {
    case UPDATE_TAB_SUCCESS:
      const newState = state.map(t => {
        if (t.id == action.data) {
          t = action.response 
          t.widgets = undefined
        }
        return t
      })
      return newState;
    case DELETE_TAB_SUCCESS:
      const idx = state.findIndex(t => t.id == action.data);
      console.log("Index found", idx, state)
      if(idx<0) {
        return state
      }
      let sliced = [...state]
      sliced.splice(idx, 1)
      return sliced
    case ADD_TAB_SUCCESS:
      return [...state, action.response]
    case FETCH_USER_SUCCESS:
      return action.response.tabs
    case FETCH_USER_FAILURE:
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return null
    default:
      return state
  }
}

function columnsById(state = {}, action) {
  switch (action.type) {
    case SAVE_TABLAYOUT_SUCCESS:
    {
      const nextState = {...state}
      nextState[action.data.tabId] = action.response
      return nextState
    }
    case DELETE_WIDGET_SUCCESS:
    {
      const nextState = {...state}
      const columns = [...nextState[action.data.tabId]]

      for(let i=0; i<columns.length; i++) {
        const idx = columns[i].indexOf(action.data.widgetId);
        if(idx !== -1) {
          let newColumn = [...columns[i]]
          newColumn.splice(idx,1)
          columns[i] = newColumn
        }
      }
      
      nextState[action.data.tabId] = columns
      return nextState
    }
    case ADD_WIDGET_SUCCESS:
    {
      const nextState = {...state}
      const columns = [...nextState[action.data.tabId]]

      let widgetIds = [...columns[0]]
      widgetIds.push(action.response.id);
      columns[0] = widgetIds

      nextState[action.data.tabId] = columns
      return nextState
    }
    case DELETE_TAB_SUCCESS:
      const newState = {...state}
      delete newState[action.data];
      return newState
    case FETCH_TAB_SUCCESS:
    case ADD_TAB_SUCCESS:
    {
      const nextState = {...state}
      const columns = action.response.widgets.map((wc) => {
        return wc.map((w) => w.id)
      })
      nextState[action.response.id] = columns;
      return nextState
    }
    case FETCH_TAB_REQUEST:
    case FETCH_TAB_FAILURE:
      return state;
    default:
      return state;
  }
}

function widgetById(state = {}, action) {
  switch (action.type) {
    case DELETE_WIDGET_SUCCESS:
    {
      const nextState = {...state}
      const widgets = {...nextState[action.data.tabId]}
      delete widgets[action.data.widgetId]
      nextState[action.data.tabId] = widgets
      return nextState
    }
    case ADD_WIDGET_SUCCESS:
    {
      const nextState = {...state}
      const widgets = {...nextState[action.data.tabId]}
      widgets[action.response.id] = action.response;
      nextState[action.data.tabId] = widgets;
      return nextState
    }
    case UPDATE_WIDGETCONFIG_SUCCESS:
    {
      const nextState = {...state}
      const widgets = {...nextState[action.data.tabId]}
      widgets[action.data.widgetId] = action.response;
      nextState[action.data.tabId] = widgets;
      return nextState
    }
    case DELETE_TAB_SUCCESS:
    {
      const newState = {...state}
      delete newState[action.data];
      return newState
    }
    case FETCH_TAB_SUCCESS:
    case ADD_TAB_SUCCESS:
    {
      const nextState = {...state}
      const widgets = {}
      action.response.widgets.forEach((col) => {
        col.forEach((w) => {
          widgets[w.id] = w
        })
      });
      nextState[action.response.id] = widgets;
      return nextState
    }
    case FETCH_TAB_REQUEST:
    case FETCH_TAB_FAILURE:
      return state;
    default:
      return state;
  }
}

const tabs = combineReducers({
    columnsById,
    widgetById,
    tabsConfig,
});

export default tabs;

export const reducer = tabs;
export const getAll = (state) => state.tabsConfig;
export const getTab = (state, id) => state.tabsConfig.find((tab) => tab.id==id);
export const getWidgets = (state, id) => {
  if(state.columnsById && state.widgetById) {
    if(id in state.columnsById && id in state.widgetById) {
      return state.columnsById[id].map((c) => c.map((widgetId) => state.widgetById[id][widgetId]))
    }
  }
  return [[],[],[],[]];
}
export const getFeedListPerTab = (state) => {
  if(state.tabsConfig) {
    const allFeeds = {};
    state.tabsConfig.forEach((t) => {
      let feeds = [];
      getWidgets(state, t.id).forEach((c) => {
        c.forEach((widget) => {
            if(widget.widgetType === 'feed') {
              feeds.push(widget.config.feed_id)
            }
        })
      })
      allFeeds[t.id] = feeds;
    })
    return allFeeds;
  }
  return {}
}
