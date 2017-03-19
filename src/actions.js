import * as api from './okihomeApi'

export const FETCH_VERSION_REQUEST = 'FETCH_VERSION_REQUEST'
export const FETCH_VERSION_SUCCESS = 'FETCH_VERSION_SUCCESS'
export const FETCH_VERSION_FAILURE = 'FETCH_VERSION_FAILURE'

export const FETCH_SERVICES_REQUEST = 'FETCH_SERVICES_REQUEST'
export const FETCH_SERVICES_SUCCESS = 'FETCH_SERVICES_SUCCESS'
export const FETCH_SERVICES_FAILURE = 'FETCH_SERVICES_FAILURE'

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

export const FETCH_FEEDITEMS_REQUEST = 'FETCH_FEEDITEMS_REQUEST'
export const FETCH_FEEDITEMS_SUCCESS = 'FETCH_FEEDITEMS_SUCCESS'
export const FETCH_FEEDITEMS_FAILURE = 'FETCH_FEEDITEMS_FAILURE'

export const READ_FEEDITEMS_REQUEST = 'READ_FEEDITEMS_REQUEST'
export const READ_FEEDITEMS_SUCCESS = 'READ_FEEDITEMS_SUCCESS'
export const READ_FEEDITEMS_FAILURE = 'READ_FEEDITEMS_FAILURE'

export const ADD_WIDGET_REQUEST = 'ADD_WIDGET_REQUEST'
export const ADD_WIDGET_SUCCESS = 'ADD_WIDGET_SUCCESS'
export const ADD_WIDGET_FAILURE = 'ADD_WIDGET_FAILURE'

export const UPDATE_WIDGETCONFIG_REQUEST = 'UPDATE_WIDGETCONFIG_REQUEST'
export const UPDATE_WIDGETCONFIG_SUCCESS = 'UPDATE_WIDGETCONFIG_SUCCESS'
export const UPDATE_WIDGETCONFIG_FAILURE = 'UPDATE_WIDGETCONFIG_FAILURE'

export const DELETE_WIDGET_REQUEST = 'DELETE_WIDGET_REQUEST'
export const DELETE_WIDGET_SUCCESS = 'DELETE_WIDGET_SUCCESS'
export const DELETE_WIDGET_FAILURE = 'DELETE_WIDGET_FAILURE'

export const FETCH_ACCOUNTS_REQUEST = 'FETCH_ACCOUNTS_REQUEST'
export const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS'
export const FETCH_ACCOUNTS_FAILURE = 'FETCH_ACCOUNTS_FAILURE'

export const REVOKE_ACCOUNT_REQUEST = 'REVOKE_ACCOUNT_REQUEST'
export const REVOKE_ACCOUNT_SUCCESS = 'REVOKE_ACCOUNT_SUCCESS'
export const REVOKE_ACCOUNT_FAILURE = 'REVOKE_ACCOUNT_FAILURE'

export const FETCH_EMAILITEMS_REQUEST = 'FETCH_EMAILITEMS_REQUEST'
export const FETCH_EMAILITEMS_SUCCESS = 'FETCH_EMAILITEMS_SUCCESS'
export const FETCH_EMAILITEMS_FAILURE = 'FETCH_EMAILITEMS_FAILURE'

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

export const fetchServices = () => createAction(
  FETCH_SERVICES_REQUEST,
  FETCH_SERVICES_SUCCESS,
  FETCH_SERVICES_FAILURE,
  (token) => api.getServices(token),
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

export const fetchFeedItems = (userId, feedId) => createAction(
  FETCH_FEEDITEMS_REQUEST,
  FETCH_FEEDITEMS_SUCCESS,
  FETCH_FEEDITEMS_FAILURE,
  (token) => api.getFeedItems(token, userId, feedId),
  true,
  {
    userId,
    feedId,
  }
);

export const readFeedItems = (userId, feedId, itemGuids) => createAction(
  READ_FEEDITEMS_REQUEST,
  READ_FEEDITEMS_SUCCESS,
  READ_FEEDITEMS_FAILURE,
  (token) => api.readFeedItems(token, userId, feedId, itemGuids),
  true,
  {
    userId,
    feedId,
    itemGuids,
  }
);

export const addWidget = (tabId, widget) => createAction(
  ADD_WIDGET_REQUEST,
  ADD_WIDGET_SUCCESS,
  ADD_WIDGET_FAILURE,
  (token) => api.addWidget(token,tabId,widget),
  true,
  {
    tabId,
    widget,
  },
);

export const saveWidgetConfig = (tabId, widgetId, data) => createAction(
  UPDATE_WIDGETCONFIG_REQUEST,
  UPDATE_WIDGETCONFIG_SUCCESS,
  UPDATE_WIDGETCONFIG_FAILURE,
  (token) => api.saveWidgetConfig(token, tabId, widgetId, data),
  true,
  {
    tabId,
    widgetId,
    data,
  }
);

export const deleteWidget = (tabId, widgetId) => createAction(
  DELETE_WIDGET_REQUEST,
  DELETE_WIDGET_SUCCESS,
  DELETE_WIDGET_FAILURE,
  (token) => api.deleteWidget(token,tabId,widgetId),
  true,
  {
    tabId,
    widgetId,
  },
);

export const fetchAccounts = (userId) => createAction(
  FETCH_ACCOUNTS_REQUEST,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_FAILURE,
  (token) => api.getAccounts(token, userId),
  true,
  {
    userId,
  }
);

export const revokeAccount = (userId, accountId) => createAction(
  REVOKE_ACCOUNT_REQUEST,
  REVOKE_ACCOUNT_SUCCESS,
  REVOKE_ACCOUNT_FAILURE,
  (token) => api.revokeAccount(token, userId, accountId),
  true,
  {
    userId,
    accountId,
  }
);

export const fetchEmailItems = (userId, accountId) => createAction(
  FETCH_EMAILITEMS_REQUEST,
  FETCH_EMAILITEMS_SUCCESS,
  FETCH_EMAILITEMS_FAILURE,
  (token) => api.getEmailItems(token, userId, accountId),
  true,
  {
    userId,
    accountId,
  }
);