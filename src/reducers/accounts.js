import { combineReducers } from 'redux'

import {FETCH_ACCOUNTS_SUCCESS, FETCH_ACCOUNTS_FAILURE, FETCH_ACCOUNTS_REQUEST} from '../actions'
import {REVOKE_ACCOUNT_SUCCESS, REVOKE_ACCOUNT_FAILURE, REVOKE_ACCOUNT_REQUEST} from '../actions'
import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';
import { FETCH_USER_FAILURE } from '../actions'
import { FETCH_EMAILITEMS_SUCCESS } from '../actions'

const accountsValue = (state = [], action) => {
    switch (action.type) {
      case REVOKE_ACCOUNT_SUCCESS:
        let newState = []
        state.forEach(function(item) {
          console.log("Checking for eq", item.id , action.data.accountId)
          if(item.id !== action.data.accountId) {
            newState.push(item);
          }
        });
        return newState;
      case FETCH_ACCOUNTS_SUCCESS:
        return action.response;
      case FETCH_ACCOUNTS_FAILURE:
      case REVOKE_ACCOUNT_FAILURE:
        return null;
      case FETCH_ACCOUNTS_REQUEST:
      case REVOKE_ACCOUNT_REQUEST:
      default:
        return state;
    }
}
function emailsByUserAccount(state = {}, action) {
  switch (action.type) {
    case FETCH_EMAILITEMS_SUCCESS:
    {
      let newState = {...state}

      let newUserState = {...newState[action.data.userId]}
      newUserState[action.data.accountId] = action.response;

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

const accounts = combineReducers({
    accountsValue,
    emailsByUserAccount,
});

export default accounts;

export const reducer = accounts;
export const getAll = (state) => state.accountsValue;
export const getEmails = (state, userId, accountId) => state.emailsByUserAccount && state.emailsByUserAccount[userId] && state.emailsByUserAccount[userId][accountId] ? state.emailsByUserAccount[userId][accountId].items : [] ;

