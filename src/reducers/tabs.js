import { combineReducers } from 'redux'

import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';
import { FETCH_USER_SUCCESS, FETCH_USER_FAILURE } from '../actions'
import { FETCH_TAB_SUCCESS, FETCH_TAB_FAILURE, FETCH_TAB_REQUEST } from '../actions'

function all(state = [], action) {
  switch (action.type) {
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
    case FETCH_TAB_SUCCESS:
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
export const getWidgets = (state, id) => state.widgetsById ? state.widgetsById[id] : [];
