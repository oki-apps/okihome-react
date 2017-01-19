import * as api from './okihomeApi'

export const FETCH_VERSION_REQUEST = 'FETCH_VERSION_REQUEST'
export const FETCH_VERSION_SUCCESS = 'FETCH_VERSION_SUCCESS'
export const FETCH_VERSION_FAILURE = 'FETCH_VERSION_FAILURE'

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'

export const FETCH_TAB_REQUEST = 'FETCH_TAB_REQUEST'
export const FETCH_TAB_SUCCESS = 'FETCH_TAB_SUCCESS'
export const FETCH_TAB_FAILURE = 'FETCH_TAB_FAILURE'

export const ADD_TAB_REQUEST = 'ADD_TAB_REQUEST'
export const ADD_TAB_SUCCESS = 'ADD_TAB_SUCCESS'
export const ADD_TAB_FAILURE = 'ADD_TAB_FAILURE'

export const UPDATE_TAB_REQUEST = 'UPDATE_TAB_REQUEST'
export const UPDATE_TAB_SUCCESS = 'UPDATE_TAB_SUCCESS'
export const UPDATE_TAB_FAILURE = 'UPDATE_TAB_FAILURE'

export const DELETE_TAB_REQUEST = 'DELETE_TAB_REQUEST'
export const DELETE_TAB_SUCCESS = 'DELETE_TAB_SUCCESS'
export const DELETE_TAB_FAILURE = 'DELETE_TAB_FAILURE'

let getToken = (getState) => {
  let state = getState();
  if(state && state.oidc && state.oidc.user) {
    return Promise.resolve(state.oidc.user.id_token);
  }
  console.log('Token required but not found')
  return new Promise(function(resolve) {
    setTimeout(() => {
      let state = getState();
      if(state && state.oidc && state.oidc.user) {
        resolve(state.oidc.user.id_token);
        return;
      }
      resolve(null)
    }, 300)
  });
}

let createAction = (fetchRequest, fetchSuccess, fetchFailure, requestFn, requiresToken = true, data = null) => 
  (dispatch, getState) => {
    dispatch({
      type: fetchRequest,
      data,
    });

    let tokenPromise = requiresToken ? getToken(getState) : Promise.resolve(null);

    return tokenPromise.then((token) => {
      return requestFn(token).then(response => {
        dispatch({
          type: fetchSuccess,
          data,
          response: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: fetchFailure,
          data,
          message: error.message || 'Unable to retrieve data'
        });
      });
    });    
}

export const fetchVersion = () => createAction(
  FETCH_VERSION_REQUEST,
  FETCH_VERSION_SUCCESS,
  FETCH_VERSION_FAILURE,
  (token) => api.getVersion(token),
  false
);

export const fetchUser = (userId) => createAction(
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  (token) => api.getUser(token,userId),
);

export const fetchTab = (tabId) => createAction(
  FETCH_TAB_REQUEST,
  FETCH_TAB_SUCCESS,
  FETCH_TAB_FAILURE,
  (token) => api.getTab(token,tabId),
);

export const addTab = (tabTitle) => createAction(
  ADD_TAB_REQUEST,
  ADD_TAB_SUCCESS,
  ADD_TAB_FAILURE,
  (token) => api.addTab(token,tabTitle),
  true,
  tabTitle
);

export const updateTab = (tabId, tabTitle) => createAction(
  UPDATE_TAB_REQUEST,
  UPDATE_TAB_SUCCESS,
  UPDATE_TAB_FAILURE,
  (token) => api.updateTab(token,tabId,tabTitle),
  true,
  tabId
);

export const deleteTab = (tabId) => createAction(
  DELETE_TAB_REQUEST,
  DELETE_TAB_SUCCESS,
  DELETE_TAB_FAILURE,
  (token) => api.deleteTab(token,tabId),
  true,
  tabId
);