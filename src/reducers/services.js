import { combineReducers } from 'redux'

import {FETCH_SERVICES_SUCCESS, FETCH_SERVICES_FAILURE, FETCH_SERVICES_REQUEST} from '../actions'

const servicesValue = (state = null, action) => {
    switch (action.type) {
      case FETCH_SERVICES_SUCCESS:
        return action.response;
      case FETCH_SERVICES_FAILURE:
        return null;
      case FETCH_SERVICES_REQUEST:
      default:
        return state;
    }
}

const isFetching = (state = false, action) => {
    switch (action.type) {
      case FETCH_SERVICES_SUCCESS:
      case FETCH_SERVICES_FAILURE:
        return false;
      case FETCH_SERVICES_REQUEST:
        return true;
      default:
        return state;
    }
}

const services = combineReducers({
    servicesValue,
    isFetching,
});

export default services;

export const reducer = services;
export const getAll = (state) => state.servicesValue;
export const getIsFetching = (state) => state.isFetching;

