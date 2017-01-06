import { combineReducers } from 'redux'

import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';
import { FETCH_USER_SUCCESS, FETCH_USER_FAILURE, FETCH_USER_REQUEST } from '../actions'

function value(state = null, action) {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      if(action.response.user) {
        return action.response.user
      }
      return state
    case FETCH_USER_FAILURE:
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return null
    case FETCH_USER_REQUEST:
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
    switch (action.type) {
      case FETCH_USER_SUCCESS:
      case FETCH_USER_FAILURE:
        return false;
      case FETCH_USER_REQUEST:
        return true;
      default:
        return state;
    }
}

const user = combineReducers({
    value,
    isFetching,
});

export default user;

export const reducer = user;
export const getUser = (state) => state.value;
export const getIsFetching = (state) => state.isFetching;
