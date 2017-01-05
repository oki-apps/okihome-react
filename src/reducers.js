import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { LOGIN, LOGOUT, SET_VERSION } from './actions'

function user(state = null, action) {
  switch (action.type) {
    case LOGIN:
      return action.user
    case LOGOUT:
      return null
    default:
      return state
  }
}

function apiVersion(state = null, action) {
  switch (action.type) {
    case SET_VERSION:
      return action.version
    default:
      return state
  }
}

const okihome = combineReducers({
  user,
  apiVersion,
  routing: routerReducer
})

export default okihome