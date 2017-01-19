import { combineReducers } from 'redux'

import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';
import { FETCH_USER_SUCCESS, FETCH_USER_FAILURE } from '../actions'
import { FETCH_TAB_SUCCESS, FETCH_TAB_FAILURE, FETCH_TAB_REQUEST } from '../actions'
import { ADD_TAB_SUCCESS } from '../actions'
import { UPDATE_TAB_SUCCESS } from '../actions'
import { DELETE_TAB_SUCCESS } from '../actions'

function all(state = [], action) {
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

function widgetsById(state = {}, action) {
  switch (action.type) {
    case DELETE_TAB_SUCCESS:
      const newState = {...state}
      delete newState[action.data];
      return newState
    case FETCH_TAB_SUCCESS:
    case ADD_TAB_SUCCESS:
      const nextState = {...state}
      nextState[action.response.id] = action.response.widgets;
      return nextState
    case FETCH_TAB_REQUEST:
    case FETCH_TAB_FAILURE:
      return state;
    default:
      return state;
  }
}

const tabs = combineReducers({
    widgetsById,
    all,
});

export default tabs;

export const reducer = tabs;
export const getAll = (state) => state.all;
export const getTab = (state, id) => state.all.find((tab) => tab.id==id);
export const getWidgets = (state, id) => state.widgetsById ? state.widgetsById[id] : [];
