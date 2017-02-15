import { combineReducers } from 'redux'

import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';
import { FETCH_USER_FAILURE } from '../actions'
import { FETCH_FEEDITEMS_SUCCESS } from '../actions'
import { READ_FEEDITEMS_REQUEST, READ_FEEDITEMS_FAILURE } from '../actions'

function itemsByUserFeed(state = {}, action) {
  switch (action.type) {
    case READ_FEEDITEMS_REQUEST:
    case READ_FEEDITEMS_FAILURE:
    {
      let newState = {...state}
      let newUserState = {...newState[action.data.userId]}
      let newFeedState = [...newUserState[action.data.feedId]]

      newFeedState.forEach(item => {
        if(action.data.itemGuids.indexOf(item.guid)>=0){
          item.read = (action.type===READ_FEEDITEMS_REQUEST);
        }
      })

      newUserState[action.data.feedId] = newFeedState;
      newState[action.data.userId] = newUserState
      return newState
    }
    case FETCH_FEEDITEMS_SUCCESS:
    {
      let newState = {...state}

      let newUserState = {...newState[action.data.userId]}
      newUserState[action.data.feedId] = action.response;

      newState[action.data.userId] = newUserState
      return newState;
    }
    case FETCH_USER_FAILURE:
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return null
    default:
      return state
  }
}

const feeds = combineReducers({
    itemsByUserFeed
});

export default feeds;

export const reducer = feeds;
export const getItems = (state, userId, feedId) => state.itemsByUserFeed && state.itemsByUserFeed[userId] ? state.itemsByUserFeed[userId][feedId] : [];
