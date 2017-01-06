import { combineReducers } from 'redux'

import {FETCH_VERSION_SUCCESS, FETCH_VERSION_FAILURE, FETCH_VERSION_REQUEST} from '../actions'

const versionValue = (state = null, action) => {
    switch (action.type) {
      case FETCH_VERSION_SUCCESS:
        return action.response.version;
      case FETCH_VERSION_FAILURE:
        return null;
      case FETCH_VERSION_REQUEST:
      default:
        return state;
    }
}

const isFetching = (state = false, action) => {
    switch (action.type) {
      case FETCH_VERSION_SUCCESS:
      case FETCH_VERSION_FAILURE:
        return false;
      case FETCH_VERSION_REQUEST:
        return true;
      default:
        return state;
    }
}

const version = combineReducers({
    versionValue,
    isFetching,
});

export default version;

export const reducer = version;
export const getVersion = (state) => state.versionValue;
export const getIsFetching = (state) => state.isFetching;

